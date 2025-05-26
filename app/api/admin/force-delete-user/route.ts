import { type NextRequest, NextResponse } from "next/server"
import { adminSupabase } from "@/lib/admin-supabase"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`Starting force deletion for user ${userId}`)

    // Try multiple deletion methods to ensure the user is removed
    try {
      // Method 1: Try admin API first
      const { error: adminError } = await adminSupabase.auth.admin.deleteUser(userId)
      if (adminError) {
        console.warn("Admin API deletion failed:", adminError.message)
      } else {
        console.log("Admin API deletion successful")
      }

      // Method 2: Try to delete related data in public schema
      try {
        await adminSupabase.from("user_achievements").delete().eq("user_id", userId)
        await adminSupabase.from("quiz_results").delete().eq("user_id", userId)
        await adminSupabase.from("user_progress").delete().eq("user_id", userId)
        await adminSupabase.from("users").delete().eq("id", userId)
        console.log("Database records deleted")
      } catch (dbError) {
        console.warn("Database deletion error:", dbError)
      }

      // Method 3: Use the stored procedure as a last resort
      try {
        const { error: rpcError } = await adminSupabase.rpc("delete_user_cascade", {
          user_id_param: userId,
        })

        if (rpcError) {
          console.warn("RPC deletion failed:", rpcError.message)
        } else {
          console.log("RPC deletion successful")
        }
      } catch (rpcError) {
        console.warn("RPC error:", rpcError)
      }

      // Method 4: Raw SQL call to the procedure as a final attempt
      try {
        const { error: sqlError } = await adminSupabase
          .from("delete_user_cascade")
          .select("*")
          .eq("user_id_param", userId)
        if (sqlError) {
          console.warn("SQL deletion failed:", sqlError.message)
        } else {
          console.log("SQL deletion successful")
        }
      } catch (sqlError) {
        console.warn("SQL error:", sqlError)
      }

      return NextResponse.json({
        success: true,
        message: "User deletion attempted through multiple methods",
      })
    } catch (error) {
      console.error("Error in force deletion:", error)
      return NextResponse.json(
        {
          error: "Server error during force deletion",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Unexpected error in force-delete-user route:", error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
