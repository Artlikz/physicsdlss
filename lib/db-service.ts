import supabase from "./supabase"

// Types for our database
export interface QuizResult {
  id?: string
  user_id: string
  module_id: number
  career_path: string
  score: number
  total_questions: number
  completed_at: string
  passed: boolean
  time_taken_sec?: number
}

export interface UserProgress {
  id?: string
  user_id: string
  career_path: string
  completed_modules: number[]
  current_module: number
  updated_at?: string
}

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: string
}

export interface UserAchievement {
  id?: string
  user_id: string
  achievement_id: string
  earned_at: string
}

// Local storage fallback for when database is not available
const LOCAL_STORAGE_KEY = "physics_lms_user_progress"

// Helper function to get progress from local storage
function getProgressFromLocalStorage(userId: string, careerPath: string): UserProgress | null {
  if (typeof window === "undefined") return null

  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!storedData) return null

    const allProgress = JSON.parse(storedData)
    const key = `${userId}_${careerPath}`
    return allProgress[key] || null
  } catch (error) {
    console.error("Error reading from local storage:", error)
    return null
  }
}

// Helper function to save progress to local storage
function saveProgressToLocalStorage(userId: string, careerPath: string, progress: UserProgress): void {
  if (typeof window === "undefined") return

  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    const allProgress = storedData ? JSON.parse(storedData) : {}
    const key = `${userId}_${careerPath}`

    allProgress[key] = progress
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allProgress))
    console.log("Progress saved to local storage")
  } catch (error) {
    console.error("Error saving to local storage:", error)
  }
}

// Auth methods
export async function signUp(email: string, password: string, full_name: string) {
  try {
    console.log("Starting signup process for:", email)

    // Check if the user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1)

    if (!checkError && existingUsers && existingUsers.length > 0) {
      return {
        data: null,
        error: {
          message: "This email is already registered. Please log in instead.",
        },
      }
    }

    // Create the user in Auth with email confirmation
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (authError) {
      console.error("Error during signup:", authError)
      return {
        data: null,
        error: {
          message: `Authentication error: ${authError.message}`,
        },
      }
    }

    // If we get here, the signup was successful
    if (authData.user) {
      try {
        // Create user record in the users table
        const newUser = {
          id: authData.user.id,
          email: email,
          full_name: full_name,
        }

        const { error: insertError } = await supabase.from("users").insert(newUser)

        if (insertError) {
          console.warn("Error creating user record:", insertError)
          // Continue anyway, as the auth user was created
        } else {
          // Initialize user progress
          await initializeUserProgress(authData.user.id)
        }
      } catch (error) {
        console.warn("Error initializing user data:", error)
        // Continue anyway, as the auth user was created
      }
    }

    return {
      data: {
        email,
        message: "Registration successful. Please check your email to verify your account.",
        user: authData.user,
      },
      error: null,
    }
  } catch (error) {
    console.error("Unexpected error in signUp:", error)
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
    }
  }
}

// Update the signIn function to handle session persistence
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Check if the error is due to email not being confirmed
      if (error.message.includes("Email not confirmed")) {
        return {
          data: null,
          error: {
            message: "Please verify your email before logging in. Check your inbox for a verification link.",
            code: "email_not_confirmed",
          },
        }
      }
      return { data: null, error }
    }

    // If login is successful, initialize user if needed
    if (data.user) {
      try {
        await initializeUserIfNeeded(data.user.id, data.user.email || "", data.user.user_metadata?.full_name || "User")
      } catch (err) {
        console.error("Error initializing user:", err)
      }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in signIn:", error)
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : "An unexpected error occurred during login",
        code: "unknown_error",
      },
    }
  }
}

// Update the getCurrentUser function to properly handle authentication state
export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getSession()

    // If no session, user is not logged in
    if (!data.session) return null

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return null

    // Try to initialize user if needed, but don't fail if it doesn't work
    try {
      await initializeUserIfNeeded(
        userData.user.id,
        userData.user.email || "",
        userData.user.user_metadata?.full_name || "User",
      )
    } catch (error) {
      console.error("Error initializing user (non-fatal):", error)
      // Continue anyway
    }

    // Try to get additional user data from the users table (if exists)
    try {
      const { data: userRecord, error } = await supabase.from("users").select("*").eq("id", userData.user.id).single()

      if (!error && userRecord) {
        return userRecord as User
      }
    } catch (error) {
      console.warn("Error getting user data from users table (using fallback):", error)
    }

    // Return basic user info from auth if users table doesn't exist or fails
    return {
      id: userData.user.id,
      email: userData.user.email || "",
      full_name: userData.user.user_metadata?.full_name || "User",
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Add this new function after the signOut function

/**
 * Deletes a user account
 * This uses the database trigger to handle cascade deletion
 */
export async function deleteUser(userId: string) {
  try {
    console.log(`Attempting to delete user with ID: ${userId}`)

    // Delete the user record - the trigger will handle related records
    const { error: userError } = await supabase.from("users").delete().eq("id", userId)

    if (userError) {
      console.error("Error deleting user record:", userError)
      throw userError
    }

    return { success: true, message: "User data deleted successfully" }
  } catch (error) {
    console.error("Error in deleteUser:", error)
    throw error
  }
}

// Update the initializeUserIfNeeded function to be more resilient
async function initializeUserIfNeeded(userId: string, email: string, fullName: string) {
  try {
    console.log("Initializing user if needed:", { userId, email, fullName })

    // Check if users table exists first
    const { error: tableCheckError } = await supabase.from("users").select("id").limit(1)

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("Users table doesn't exist, skipping user initialization")
      // Initialize progress in local storage instead
      await initializeUserProgressInLocalStorage(userId)
      return
    }

    // Check if user exists in users table
    const { data, error } = await supabase.from("users").select("id").eq("id", userId).single()

    if (error && error.code !== "PGRST116") {
      console.error("Error checking user existence:", error)
      // Fall back to local storage initialization
      await initializeUserProgressInLocalStorage(userId)
      return
    }

    if (!data) {
      console.log("User doesn't exist in users table, attempting to create...")

      // Create user record if it doesn't exist
      const newUser = {
        id: userId,
        email: email,
        full_name: fullName,
      }

      // Try to insert the user record directly first
      const { error: insertError } = await supabase.from("users").insert(newUser)

      if (insertError) {
        console.error("Error creating user record directly:", insertError)

        // If it's an RLS error and we have the required environment variables, try the API
        if (
          insertError.message.includes("row-level security policy") &&
          process.env.NEXT_PUBLIC_SUPABASE_URL &&
          process.env.SUPABASE_SERVICE_ROLE_KEY
        ) {
          console.log("Attempting to create user via API...")

          try {
            const response = await fetch("/api/create-user-record", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newUser),
            })

            // Handle response properly
            const contentType = response.headers.get("content-type")
            let result

            if (contentType && contentType.includes("application/json")) {
              try {
                result = await response.json()
              } catch (jsonError) {
                console.error("Error parsing JSON response:", jsonError)
                throw new Error("Invalid JSON response from API")
              }
            } else {
              const textResponse = await response.text()
              console.error("Non-JSON response received:", textResponse)
              throw new Error("Expected JSON response but got text")
            }

            if (!response.ok) {
              console.error("API response not ok:", response.status, result)
              throw new Error(`API returned ${response.status}: ${result.error || "Unknown error"}`)
            } else {
              console.log("User record created successfully via API:", result.message)
            }
          } catch (apiError) {
            console.error("Error calling user creation API:", apiError)
            console.log("Falling back to local storage initialization")
            await initializeUserProgressInLocalStorage(userId)
            return
          }
        } else {
          console.log("Cannot use API (missing env vars or different error), falling back to local storage")
          await initializeUserProgressInLocalStorage(userId)
          return
        }
      } else {
        console.log("User record created successfully")
      }

      // Initialize user progress in database if user was created successfully
      try {
        await initializeUserProgress(userId)
      } catch (progressError) {
        console.error("Error initializing user progress in database:", progressError)
        await initializeUserProgressInLocalStorage(userId)
      }
    } else {
      console.log("User record already exists")
    }
  } catch (error) {
    console.error("Error in initializeUserIfNeeded:", error)
    // Fall back to local storage initialization
    await initializeUserProgressInLocalStorage(userId)
  }
}

// New function to initialize progress in local storage only
async function initializeUserProgressInLocalStorage(userId: string) {
  console.log("Initializing user progress in local storage only")

  const careerPaths = ["engineer", "doctor", "pilot"]

  for (const path of careerPaths) {
    const progress = {
      user_id: userId,
      career_path: path,
      completed_modules: [],
      current_module: 1,
      updated_at: new Date().toISOString(),
    }

    saveProgressToLocalStorage(userId, path, progress)
  }
}

// Replace the initializeUserProgress function with this version that doesn't rely on RPC calls
async function initializeUserProgress(userId: string) {
  try {
    // Check if table exists
    const { error: tableCheckError } = await supabase.from("user_progress").select("id").limit(1)

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("User progress table doesn't exist, using local storage instead")
      await initializeUserProgressInLocalStorage(userId)
      return
    }

    const careerPaths = ["engineer", "doctor", "pilot"]

    for (const path of careerPaths) {
      // Check if progress already exists
      const { data, error } = await supabase
        .from("user_progress")
        .select("id")
        .eq("user_id", userId)
        .eq("career_path", path)
        .single()

      if ((error && error.code !== "PGRST116") || data) {
        continue // Skip if error or record exists
      }

      // Create progress record if it doesn't exist
      const { error: insertError } = await supabase.from("user_progress").insert({
        user_id: userId,
        career_path: path,
        completed_modules: [],
        current_module: 1,
      })

      if (insertError) {
        console.error(`Error creating progress for ${path}:`, insertError)
      }
    }
  } catch (error) {
    console.error("Error in initializeUserProgress:", error)
    // Fall back to local storage
    await initializeUserProgressInLocalStorage(userId)
  }
}

// User progress methods
export async function getUserProgress(userId: string, careerPath: string): Promise<UserProgress | null> {
  try {
    // Default progress object to return if anything fails
    const defaultProgress = {
      user_id: userId,
      career_path: careerPath,
      completed_modules: [],
      current_module: 1,
    }

    // First try to get progress from local storage
    const localProgress = getProgressFromLocalStorage(userId, careerPath)
    if (localProgress) {
      console.log("Retrieved progress from local storage:", localProgress)
      return localProgress
    }

    // Check if table exists and has the correct structure
    try {
      const { data: tableStructure, error: structureError } = await supabase
        .from("user_progress")
        .select("career_path")
        .limit(1)

      if (structureError) {
        if (
          structureError.message.includes("does not exist") ||
          (structureError.message.includes("column") && structureError.message.includes("career_path"))
        ) {
          console.log(
            "User progress table doesn't exist or missing career_path column, using default progress and saving to local storage",
          )
          saveProgressToLocalStorage(userId, careerPath, defaultProgress)
          return defaultProgress
        }
      }
    } catch (error) {
      console.error("Error checking table structure:", error)
      saveProgressToLocalStorage(userId, careerPath, defaultProgress)
      return defaultProgress
    }

    try {
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("career_path", careerPath)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          // No record found, try to create one but don't fail if it doesn't work
          try {
            await supabase.from("user_progress").insert({
              user_id: userId,
              career_path: careerPath,
              completed_modules: [],
              current_module: 1,
            })
          } catch (insertError) {
            console.error("Error creating progress:", insertError)
          }
        } else {
          console.error("Error getting user progress:", error)
        }

        // Save default progress to local storage as backup
        saveProgressToLocalStorage(userId, careerPath, defaultProgress)
        return defaultProgress
      }

      // Save to local storage as backup
      saveProgressToLocalStorage(userId, careerPath, data as UserProgress)
      return data as UserProgress
    } catch (error) {
      console.error("Error in getUserProgress database query:", error)
      saveProgressToLocalStorage(userId, careerPath, defaultProgress)
      return defaultProgress
    }
  } catch (error) {
    console.error("Error in getUserProgress:", error)
    const defaultProgress = {
      user_id: userId,
      career_path: careerPath,
      completed_modules: [],
      current_module: 1,
    }
    saveProgressToLocalStorage(userId, careerPath, defaultProgress)
    return defaultProgress
  }
}

// Replace the updateUserProgress function with this improved version that doesn't rely on RPC calls

export async function updateUserProgress(userId: string, careerPath: string, moduleId: number) {
  console.log(`Updating progress for user ${userId}, path ${careerPath}, module ${moduleId}`)

  try {
    if (!userId) {
      console.error("Error: userId is required for updating progress")
      throw new Error("userId is required")
    }

    // Get current progress - this will return a default object if DB access fails
    const progress = await getUserProgress(userId, careerPath)

    // Add module to completed modules if not already there
    const completedModules = Array.isArray(progress?.completed_modules) ? [...progress.completed_modules] : []

    if (!completedModules.includes(moduleId)) {
      completedModules.push(moduleId)
    }

    // Sort the completed modules array
    completedModules.sort((a, b) => a - b)

    // Set the next module as current
    const nextModule = moduleId + 1

    console.log(`Updating progress: Completed modules: ${completedModules}, Next module: ${nextModule}`)

    // Create updated progress object
    const updatedProgress = {
      user_id: userId,
      career_path: careerPath,
      completed_modules: completedModules,
      current_module: nextModule,
      updated_at: new Date().toISOString(),
    }

    // Always update local storage
    saveProgressToLocalStorage(userId, careerPath, updatedProgress)

    // First, check if the user_progress table exists
    try {
      const { error: tableCheckError } = await supabase.from("user_progress").select("id").limit(1)

      if (tableCheckError) {
        if (tableCheckError.message.includes("does not exist")) {
          console.log("User progress table doesn't exist, using local storage only")
          return updatedProgress
        } else {
          console.error("Error checking user_progress table:", tableCheckError)
          return updatedProgress
        }
      }
    } catch (tableError) {
      console.error("Error checking user_progress table:", tableError)
      return updatedProgress
    }

    // Try to update the database
    try {
      // First try the standard upsert approach
      const { error } = await supabase.from("user_progress").upsert(updatedProgress)

      if (error) {
        console.error("Error using upsert for progress update:", error)

        // Try a direct insert approach as fallback
        try {
          // Check if record exists
          const { data: existingRecord, error: checkError } = await supabase
            .from("user_progress")
            .select("id")
            .eq("user_id", userId)
            .eq("career_path", careerPath)
            .single()

          if (checkError && checkError.code !== "PGRST116") {
            console.error("Error checking existing record:", checkError)
            return updatedProgress
          }

          if (existingRecord) {
            // Update existing record
            const { error: updateError } = await supabase
              .from("user_progress")
              .update({
                completed_modules: completedModules,
                current_module: nextModule,
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", userId)
              .eq("career_path", careerPath)

            if (updateError) {
              console.error("Error updating existing record:", updateError)
              return updatedProgress
            }
          } else {
            // Insert new record
            const { error: insertError } = await supabase.from("user_progress").insert(updatedProgress)

            if (insertError) {
              console.error("Error inserting new record:", insertError)
              return updatedProgress
            }
          }
        } catch (directError) {
          console.error("Error with direct insert/update approach:", directError)
          return updatedProgress
        }
      }

      console.log("Progress updated successfully in database")
      return updatedProgress
    } catch (dbError) {
      console.error("Error updating progress in database:", dbError)
      return updatedProgress
    }
  } catch (error) {
    console.error("Error in updateUserProgress:", error)

    // Create a fallback progress object
    const fallbackProgress = {
      user_id: userId,
      career_path: careerPath,
      completed_modules: [moduleId],
      current_module: moduleId + 1,
      updated_at: new Date().toISOString(),
    }

    // Save to local storage
    saveProgressToLocalStorage(userId, careerPath, fallbackProgress)

    return fallbackProgress
  }
}

// Quiz results methods
export async function saveQuizResult(result: Omit<QuizResult, "id" | "completed_at">) {
  console.log("Saving quiz result:", result)

  try {
    // Always update progress if passed
    if (result.passed) {
      await updateUserProgress(result.user_id, result.career_path, result.module_id)
    }

    // Check if table exists
    const { error: tableCheckError } = await supabase.from("quiz_results").select("id").limit(1)

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("Quiz results table doesn't exist, skipping database save")

      return {
        ...result,
        id: "temp-id",
        completed_at: new Date().toISOString(),
      }
    }

    // Insert the quiz result
    const { data, error } = await supabase
      .from("quiz_results")
      .insert({
        ...result,
        completed_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Error saving quiz result:", error)
      return {
        ...result,
        id: "temp-id",
        completed_at: new Date().toISOString(),
      }
    }

    console.log("Quiz result saved:", data)
    return data[0] as QuizResult
  } catch (error) {
    console.error("Error in saveQuizResult:", error)

    return {
      ...result,
      id: "temp-id",
      completed_at: new Date().toISOString(),
    }
  }
}

export async function getQuizResults(userId: string, careerPath?: string) {
  try {
    // Check if table exists
    const { error: tableCheckError } = await supabase.from("quiz_results").select("id").limit(1)

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("Quiz results table doesn't exist, returning empty array")
      return []
    }

    let query = supabase.from("quiz_results").select("*").eq("user_id", userId)

    if (careerPath) {
      query = query.eq("career_path", careerPath)
    }

    const { data, error } = await query.order("completed_at", { ascending: false })

    if (error) {
      console.error("Error getting quiz results:", error)
      return []
    }

    return data as QuizResult[]
  } catch (error) {
    console.error("Error in getQuizResults:", error)
    return []
  }
}

// Update the isModuleUnlocked function to handle missing tables

export async function isModuleUnlocked(userId: string, careerPath: string, moduleId: number): Promise<boolean> {
  console.log(`Checking if module ${moduleId} is unlocked for user ${userId} in path ${careerPath}`)

  // First module is always unlocked
  if (moduleId === 1) {
    console.log("First module is always unlocked")
    return true
  }

  try {
    // Try to get progress from local storage first
    const localProgress = getProgressFromLocalStorage(userId, careerPath)
    if (localProgress) {
      console.log("Using local storage to check module unlock status")
      const completedModules = Array.isArray(localProgress.completed_modules) ? localProgress.completed_modules : []
      const isUnlocked = completedModules.includes(moduleId - 1)

      console.log(`Module ${moduleId} unlock status from local storage: ${isUnlocked}`)
      console.log(`Completed modules from local storage: ${completedModules.join(", ")}`)

      return isUnlocked
    }

    // Check if the database table exists
    const { error: tableCheckError } = await supabase.from("user_progress").select("id").limit(1)

    if (tableCheckError) {
      console.log("User progress table doesn't exist, using default unlock rules")
      // By default, only module 1 is unlocked
      return false
    }

    // If we get here, the table exists, so try to get the progress
    const progress = await getUserProgress(userId, careerPath)

    // Check if previous module is completed
    const completedModules = Array.isArray(progress.completed_modules) ? progress.completed_modules : []

    console.log(`Completed modules for user ${userId}: ${JSON.stringify(completedModules)}`)

    // Module is unlocked only if the previous module is completed with perfect score
    const isUnlocked = completedModules.includes(moduleId - 1)

    console.log(`Module ${moduleId} unlock status: ${isUnlocked}`)
    console.log(`Completed modules: ${completedModules.join(", ")}`)

    return isUnlocked
  } catch (error) {
    console.error("Error checking module unlock status:", error)
    return false
  }
}

// Achievement system
export async function getUserAchievements(userId: string) {
  try {
    // Check if table exists
    const { error: tableCheckError } = await supabase.from("user_achievements").select("id").limit(1)

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("User achievements table doesn't exist, returning empty array")
      return []
    }

    const { data, error } = await supabase
      .from("user_achievements")
      .select(`
     id,
     earned_at,
     achievements (
       id,
       name,
       description,
       icon
     )
   `)
      .eq("user_id", userId)

    if (error) {
      console.error("Error getting user achievements:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Error in getUserAchievements:", error)
    return []
  }
}

export async function checkAndAwardAchievements(userId: string, careerPath: string, completedModules: number) {
  try {
    // Check if tables exist
    const { error: tableCheckError } = await supabase.from("user_achievements").select("id").limit(1)

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("User achievements table doesn't exist, skipping achievement check")
      return
    }

    // Define achievements conditions
    const achievements = [
      {
        id: "first_module",
        condition: completedModules >= 1,
        name: "First Step",
        description: "Complete your first module",
        icon: "rocket",
      },
      {
        id: "five_modules",
        condition: completedModules >= 5,
        name: "Halfway There",
        description: "Complete 5 modules",
        icon: "milestone",
      },
      {
        id: `${careerPath}_master`,
        condition: completedModules >= 6,
        name: `${careerPath.charAt(0).toUpperCase() + careerPath.slice(1)} Master`,
        description: `Complete all modules in the ${careerPath} path`,
        icon: "award",
      },
    ]

    // Check which achievements are earned
    for (const achievement of achievements) {
      if (achievement.condition) {
        // Check if already awarded
        const { data } = await supabase
          .from("user_achievements")
          .select("id")
          .eq("user_id", userId)
          .eq("achievement_id", achievement.id)
          .single()

        if (!data) {
          // Award new achievement
          await supabase.from("user_achievements").insert({
            user_id: userId,
            achievement_id: achievement.id,
            earned_at: new Date().toISOString(),
          })

          // Make sure achievement exists in achievements table
          const { data: existingAchievement } = await supabase
            .from("achievements")
            .select("id")
            .eq("id", achievement.id)
            .single()

          if (!existingAchievement) {
            await supabase.from("achievements").insert({
              id: achievement.id,
              name: achievement.name,
              description: achievement.description,
              icon: achievement.icon,
              condition: achievement.condition.toString(),
            })
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in checkAndAwardAchievements:", error)
  }
}

// Recommended resources
export async function getRecommendedResources(moduleId: number, careerPath: string) {
  try {
    // Check if table exists
    const { error: tableCheckError } = await supabase.from("learning_resources").select("id").limit(1)

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("Learning resources table doesn't exist, returning empty array")
      return []
    }

    const { data, error } = await supabase
      .from("learning_resources")
      .select("*")
      .eq("module_id", moduleId)
      .eq("career_path", careerPath)
      .limit(5)

    if (error) {
      console.error("Error getting recommended resources:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getRecommendedResources:", error)
    return []
  }
}
