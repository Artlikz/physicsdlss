import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with admin privileges
const supabaseAdmin = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")

export async function POST(request: Request) {
  try {
    const { userId, newName } = await request.json()

    if (!userId || !newName) {
      return NextResponse.json({ success: false, error: "User ID and new name are required" }, { status: 400 })
    }

    // Validate the name
    if (newName.trim().length < 2) {
      return NextResponse.json({ success: false, error: "Name must be at least 2 characters long" }, { status: 400 })
    }

    // Update the user's name in the users table
    const { error: userError } = await supabaseAdmin
      .from("users")
      .update({ full_name: newName.trim() })
      .eq("id", userId)

    if (userError) {
      console.error("Error updating user name in users table:", userError)
      return NextResponse.json({ success: false, error: userError.message }, { status: 500 })
    }

    // Also update the user's metadata in auth.users
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { full_name: newName.trim() },
    })

    if (authError) {
      console.error("Error updating user metadata:", authError)
      // Continue anyway as the main user record was updated
    }

    return NextResponse.json({
      success: true,
      message: "User name updated successfully",
    })
  } catch (error) {
    console.error("Error in update-user-name API route:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
