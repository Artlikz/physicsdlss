import { type NextRequest, NextResponse } from "next/server"
import { adminSupabase } from "@/lib/admin-supabase"
import supabase from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    // Get the current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Session error:", sessionError)
      return NextResponse.json({ error: "Authentication error", details: sessionError }, { status: 401 })
    }

    if (!sessionData.session) {
      console.error("No session found")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = sessionData.session.user.id
    console.log(`Starting admin deletion for user ${userId}`)

    // Step 1: Delete the user using the admin API
    try {
      const { error: adminError } = await adminSupabase.auth.admin.deleteUser(userId)

      if (adminError) {
        console.error("Admin API error:", adminError)
        return NextResponse.json(
          {
            error: "Failed to delete user with admin API",
            details: adminError.message,
          },
          { status: 500 },
        )
      }

      console.log("Successfully deleted user with admin API")

      // Step 2: Clean up any remaining records in public schema
      try {
        // These deletions should now work since the auth user is gone
        await adminSupabase.from("user_achievements").delete().eq("user_id", userId)
        await adminSupabase.from("quiz_results").delete().eq("user_id", userId)
        await adminSupabase.from("user_progress").delete().eq("user_id", userId)
        await adminSupabase.from("users").delete().eq("id", userId)

        console.log("Successfully cleaned up remaining user data")
      } catch (cleanupError) {
        console.warn("Error during cleanup (non-critical):", cleanupError)
        // Continue anyway since the auth user is deleted
      }

      return NextResponse.json({
        success: true,
        message: "User deleted successfully",
      })
    } catch (error) {
      console.error("Error in admin deletion:", error)
      return NextResponse.json(
        {
          error: "Server error during admin deletion",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Unexpected error in delete-user admin route:", error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
