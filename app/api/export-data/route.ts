import { type NextRequest, NextResponse } from "next/server"
import { getUserStatistics } from "@/lib/data-service"
import { getCurrentUser } from "@/lib/db-service"

export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 },
      )
    }

    // Get user statistics
    const stats = await getUserStatistics(user.id)

    // Format data for export
    const exportData = {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
      progress: stats.progressByPath,
      quizzes: stats.recentQuizzes,
      achievements: stats.achievements,
      summary: {
        totalModulesCompleted: stats.totalModulesCompleted,
        totalQuizzesTaken: stats.totalQuizzesTaken,
        totalQuizzesPassed: stats.totalQuizzesPassed,
        averageScore: stats.averageScore,
        totalAchievements: stats.totalAchievements,
      },
    }

    // Return the data
    return NextResponse.json({
      success: true,
      data: exportData,
    })
  } catch (error) {
    console.error("Error exporting user data:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to export user data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
