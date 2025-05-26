import supabase from "./supabase"
import type { User, UserProgress, QuizResult, Achievement, UserAchievement } from "./db-service"

// Learning resource type
export interface LearningResource {
  id?: string
  title: string
  description: string
  url: string
  resource_type: string
  module_id: number
  career_path: string
}

// ==================== USER MANAGEMENT ====================

export async function createUser(userData: Omit<User, "id">) {
  const { data, error } = await supabase.from("users").insert(userData).select().single()

  if (error) throw error
  return data as User
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) throw error
  return data as User
}

export async function updateUser(userId: string, userData: Partial<User>) {
  const { data, error } = await supabase
    .from("users")
    .update({
      ...userData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data as User
}

export async function deleteUser(userId: string) {
  const { error } = await supabase.from("users").delete().eq("id", userId)

  if (error) throw error
  return true
}

export async function getAllUsers(page = 1, limit = 10) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase.from("users").select("*", { count: "exact" }).range(from, to)

  if (error) throw error
  return {
    users: data as User[],
    total: count || 0,
    page,
    limit,
    totalPages: count ? Math.ceil(count / limit) : 0,
  }
}

// ==================== PROGRESS MANAGEMENT ====================

export async function createUserProgress(progressData: Omit<UserProgress, "id" | "updated_at">) {
  const { data, error } = await supabase
    .from("user_progress")
    .insert({
      ...progressData,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data as UserProgress
}

export async function getUserProgressById(progressId: string) {
  const { data, error } = await supabase.from("user_progress").select("*").eq("id", progressId).single()

  if (error) throw error
  return data as UserProgress
}

export async function updateUserProgress(progressId: string, progressData: Partial<UserProgress>) {
  const { data, error } = await supabase
    .from("user_progress")
    .update({
      ...progressData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", progressId)
    .select()
    .single()

  if (error) throw error
  return data as UserProgress
}

export async function deleteUserProgress(progressId: string) {
  const { error } = await supabase.from("user_progress").delete().eq("id", progressId)

  if (error) throw error
  return true
}

export async function getAllUserProgress(userId: string) {
  const { data, error } = await supabase.from("user_progress").select("*").eq("user_id", userId)

  if (error) throw error
  return data as UserProgress[]
}

// ==================== QUIZ RESULTS MANAGEMENT ====================

export async function createQuizResult(resultData: Omit<QuizResult, "id" | "completed_at">) {
  const { data, error } = await supabase
    .from("quiz_results")
    .insert({
      ...resultData,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data as QuizResult
}

export async function getQuizResultById(resultId: string) {
  const { data, error } = await supabase.from("quiz_results").select("*").eq("id", resultId).single()

  if (error) throw error
  return data as QuizResult
}

export async function updateQuizResult(resultId: string, resultData: Partial<QuizResult>) {
  const { data, error } = await supabase.from("quiz_results").update(resultData).eq("id", resultId).select().single()

  if (error) throw error
  return data as QuizResult
}

export async function deleteQuizResult(resultId: string) {
  const { error } = await supabase.from("quiz_results").delete().eq("id", resultId)

  if (error) throw error
  return true
}

export async function getQuizResultsByUser(userId: string, options = { limit: 10, page: 1 }) {
  const { limit, page } = options
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from("quiz_results")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .range(from, to)

  if (error) throw error
  return {
    results: data as QuizResult[],
    total: count || 0,
    page,
    limit,
    totalPages: count ? Math.ceil(count / limit) : 0,
  }
}

export async function getQuizResultsByModule(moduleId: number, options = { limit: 10, page: 1 }) {
  const { limit, page } = options
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from("quiz_results")
    .select("*", { count: "exact" })
    .eq("module_id", moduleId)
    .order("completed_at", { ascending: false })
    .range(from, to)

  if (error) throw error
  return {
    results: data as QuizResult[],
    total: count || 0,
    page,
    limit,
    totalPages: count ? Math.ceil(count / limit) : 0,
  }
}

// ==================== ACHIEVEMENTS MANAGEMENT ====================

export async function createAchievement(achievementData: Achievement) {
  const { data, error } = await supabase.from("achievements").insert(achievementData).select().single()

  if (error) throw error
  return data as Achievement
}

export async function getAchievementById(achievementId: string) {
  const { data, error } = await supabase.from("achievements").select("*").eq("id", achievementId).single()

  if (error) throw error
  return data as Achievement
}

export async function updateAchievement(achievementId: string, achievementData: Partial<Achievement>) {
  const { data, error } = await supabase
    .from("achievements")
    .update(achievementData)
    .eq("id", achievementId)
    .select()
    .single()

  if (error) throw error
  return data as Achievement
}

export async function deleteAchievement(achievementId: string) {
  const { error } = await supabase.from("achievements").delete().eq("id", achievementId)

  if (error) throw error
  return true
}

export async function getAllAchievements() {
  const { data, error } = await supabase.from("achievements").select("*")

  if (error) throw error
  return data as Achievement[]
}

// ==================== USER ACHIEVEMENTS MANAGEMENT ====================

export async function awardAchievementToUser(userAchievement: Omit<UserAchievement, "id" | "earned_at">) {
  const { data, error } = await supabase
    .from("user_achievements")
    .insert({
      ...userAchievement,
      earned_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data as UserAchievement
}

export async function removeAchievementFromUser(userAchievementId: string) {
  const { error } = await supabase.from("user_achievements").delete().eq("id", userAchievementId)

  if (error) throw error
  return true
}

export async function getUserAchievementById(userAchievementId: string) {
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
    .eq("id", userAchievementId)
    .single()

  if (error) throw error
  return data
}

// ==================== LEARNING RESOURCES MANAGEMENT ====================

export async function createLearningResource(resourceData: Omit<LearningResource, "id">) {
  const { data, error } = await supabase.from("learning_resources").insert(resourceData).select().single()

  if (error) throw error
  return data as LearningResource
}

export async function getLearningResourceById(resourceId: string) {
  const { data, error } = await supabase.from("learning_resources").select("*").eq("id", resourceId).single()

  if (error) throw error
  return data as LearningResource
}

export async function updateLearningResource(resourceId: string, resourceData: Partial<LearningResource>) {
  const { data, error } = await supabase
    .from("learning_resources")
    .update(resourceData)
    .eq("id", resourceId)
    .select()
    .single()

  if (error) throw error
  return data as LearningResource
}

export async function deleteLearningResource(resourceId: string) {
  const { error } = await supabase.from("learning_resources").delete().eq("id", resourceId)

  if (error) throw error
  return true
}

export async function getLearningResourcesByModule(moduleId: number, careerPath: string) {
  const { data, error } = await supabase
    .from("learning_resources")
    .select("*")
    .eq("module_id", moduleId)
    .eq("career_path", careerPath)

  if (error) throw error
  return data as LearningResource[]
}

export async function getAllLearningResources(options = { limit: 10, page: 1 }) {
  const { limit, page } = options
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from("learning_resources")
    .select("*", { count: "exact" })
    .range(from, to)

  if (error) throw error
  return {
    resources: data as LearningResource[],
    total: count || 0,
    page,
    limit,
    totalPages: count ? Math.ceil(count / limit) : 0,
  }
}

// ==================== SEARCH FUNCTIONALITY ====================

export async function searchLearningResources(query: string, options = { limit: 10, page: 1 }) {
  const { limit, page } = options
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from("learning_resources")
    .select("*", { count: "exact" })
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .range(from, to)

  if (error) throw error
  return {
    resources: data as LearningResource[],
    total: count || 0,
    page,
    limit,
    totalPages: count ? Math.ceil(count / limit) : 0,
  }
}

// ==================== STATISTICS AND ANALYTICS ====================

export async function getUserStatistics(userId: string) {
  // Get user progress across all career paths
  const { data: progressData, error: progressError } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)

  if (progressError) throw progressError

  // Get quiz results
  const { data: quizData, error: quizError } = await supabase.from("quiz_results").select("*").eq("user_id", userId)

  if (quizError) throw quizError

  // Get achievements
  const { data: achievementData, error: achievementError } = await supabase
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

  if (achievementError) throw achievementError

  // Calculate statistics
  const totalModulesCompleted = progressData.reduce(
    (sum, progress) => sum + (progress.completed_modules?.length || 0),
    0,
  )

  const totalQuizzesTaken = quizData.length
  const totalQuizzesPassed = quizData.filter((quiz) => quiz.passed).length
  const averageScore =
    quizData.length > 0
      ? quizData.reduce((sum, quiz) => sum + (quiz.score / quiz.total_questions) * 100, 0) / quizData.length
      : 0

  const totalAchievements = achievementData.length

  return {
    totalModulesCompleted,
    totalQuizzesTaken,
    totalQuizzesPassed,
    averageScore,
    totalAchievements,
    progressByPath: progressData,
    recentQuizzes: quizData.slice(0, 5),
    achievements: achievementData,
  }
}

export async function getSystemStatistics() {
  // Get total users
  const { count: totalUsers, error: usersError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })

  if (usersError) throw usersError

  // Get total quizzes taken
  const { count: totalQuizzes, error: quizzesError } = await supabase
    .from("quiz_results")
    .select("*", { count: "exact", head: true })

  if (quizzesError) throw quizzesError

  // Get total achievements awarded
  const { count: totalAchievements, error: achievementsError } = await supabase
    .from("user_achievements")
    .select("*", { count: "exact", head: true })

  if (achievementsError) throw achievementsError

  // Get most popular career path
  const { data: careerPathData, error: careerPathError } = await supabase
    .from("user_progress")
    .select("career_path, count")
    .select("career_path")
    .group("career_path")
    .order("count", { ascending: false })
    .limit(1)

  if (careerPathError) throw careerPathError

  return {
    totalUsers: totalUsers || 0,
    totalQuizzes: totalQuizzes || 0,
    totalAchievements: totalAchievements || 0,
    mostPopularCareerPath: careerPathData.length > 0 ? careerPathData[0].career_path : null,
  }
}
