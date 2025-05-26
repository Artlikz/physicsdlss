import { NextResponse } from "next/server"
import supabaseAdmin from "@/lib/admin-supabase"

export async function GET() {
  try {
    // Create a stored procedure for admin user deletion
    const { error } = await supabaseAdmin.rpc("setup_admin_delete_procedure")

    if (error) {
      console.error("Error setting up procedure:", error)
      return NextResponse.json({ error: "Failed to set up procedure", details: error }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Admin delete procedure set up successfully" })
  } catch (error) {
    console.error("Error in setup-delete-procedure:", error)
    return NextResponse.json(
      { error: "Server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
