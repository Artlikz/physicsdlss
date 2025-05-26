import { adminSupabase } from "./admin-supabase"

// Create a user with the admin client
export async function createUser(email: string, password: string, fullName: string) {
  try {
    // Create the user in Auth
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: { full_name: fullName },
    })

    if (authError) {
      console.error("Error creating user:", authError)
      return {
        data: null,
        error: {
          message: `Authentication error: ${authError.message}`,
        },
      }
    }

    // If we get here, the user creation was successful
    if (authData.user) {
      try {
        // Create user record in the users table
        const newUser = {
          id: authData.user.id,
          email: email,
          full_name: fullName,
        }

        const { error: insertError } = await adminSupabase.from("users").insert(newUser)

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
        id: authData.user.id,
        email,
        full_name: fullName,
      },
      error: null,
    }
  } catch (error) {
    console.error("Unexpected error in createUser:", error)
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
    }
  }
}

// Get all users
export async function getAllUsers() {
  try {
    const { data, error } = await adminSupabase.from("users").select("*")

    if (error) {
      console.error("Error getting users:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllUsers:", error)
    return []
  }
}

// Delete a user
export async function deleteUser(userId: string) {
  try {
    // Delete the user from Auth
    const { error: authError } = await adminSupabase.auth.admin.deleteUser(userId)

    if (authError) {
      console.error("Error deleting user from auth:", authError)
      throw authError
    }

    // Delete the user from the users table
    const { error: dbError } = await adminSupabase.from("users").delete().eq("id", userId)

    if (dbError) {
      console.error("Error deleting user from database:", dbError)
      throw dbError
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteUser:", error)
    throw error
  }
}

// Initialize user progress for a new user
async function initializeUserProgress(userId: string) {
  try {
    // Check if table exists
    const { error: tableCheckError } = await adminSupabase.from("user_progress").select("id").limit(1)

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("User progress table doesn't exist, skipping initialization")
      return
    }

    const careerPaths = ["engineer", "doctor", "pilot"]

    for (const path of careerPaths) {
      // Check if progress already exists
      const { data, error } = await adminSupabase
        .from("user_progress")
        .select("id")
        .eq("user_id", userId)
        .eq("career_path", path)
        .single()

      if ((error && error.code !== "PGRST116") || data) {
        continue // Skip if error or record exists
      }

      // Create progress record if it doesn't exist
      const { error: insertError } = await adminSupabase.from("user_progress").insert({
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
  }
}
