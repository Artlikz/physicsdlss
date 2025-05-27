import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("API: Starting user record creation")

    // Check if we have the required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error("API: Missing NEXT_PUBLIC_SUPABASE_URL")
      return NextResponse.json({ error: "Missing Supabase URL configuration" }, { status: 500 })
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("API: Missing SUPABASE_SERVICE_ROLE_KEY")
      return NextResponse.json({ error: "Missing service role key configuration" }, { status: 500 })
    }

    // Dynamically import Supabase to avoid build issues
    const { createClient } = await import("@supabase/supabase-js")

    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    let body
    try {
      body = await request.json()
      console.log("API: Request body received:", {
        hasId: !!body.id,
        hasEmail: !!body.email,
        hasFullName: !!body.full_name,
      })
    } catch (parseError) {
      console.error("API: Error parsing request body:", parseError)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { id, email, full_name } = body

    if (!id || !email || !full_name) {
      console.error("API: Missing required fields:", { id: !!id, email: !!email, full_name: !!full_name })
      return NextResponse.json(
        { error: "Missing required fields: id, email, and full_name are required" },
        { status: 400 },
      )
    }

    // Test database connection first
    try {
      console.log("API: Testing database connection...")
      const { error: connectionError } = await supabaseAdmin.from("users").select("id").limit(1)

      if (connectionError) {
        if (connectionError.message.includes("does not exist")) {
          console.log("API: Users table doesn't exist, returning success without creating record")
          return NextResponse.json({
            message: "Database tables not set up yet, user creation skipped",
            tableExists: false,
          })
        } else {
          console.error("API: Database connection error:", connectionError)
          return NextResponse.json(
            {
              error: "Database connection failed",
              details: connectionError.message,
            },
            { status: 500 },
          )
        }
      }
      console.log("API: Database connection successful")
    } catch (connError) {
      console.error("API: Database connection exception:", connError)
      return NextResponse.json(
        {
          error: "Database connection exception",
          details: connError instanceof Error ? connError.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    // Check if user already exists
    try {
      console.log("API: Checking if user exists...")
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("id", id)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        console.error("API: Error checking existing user:", checkError)
        return NextResponse.json(
          {
            error: "Failed to check existing user",
            details: checkError.message,
          },
          { status: 500 },
        )
      }

      if (existingUser) {
        console.log("API: User already exists")
        return NextResponse.json({ message: "User already exists", userExists: true })
      }
    } catch (checkErr) {
      console.error("API: Exception checking existing user:", checkErr)
      return NextResponse.json(
        {
          error: "Exception checking existing user",
          details: checkErr instanceof Error ? checkErr.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    // Create user record using service role (bypasses RLS)
    try {
      console.log("API: Creating user record...")
      const { error: insertError } = await supabaseAdmin.from("users").insert({
        id,
        email,
        full_name,
      })

      if (insertError) {
        console.error("API: Error creating user record:", insertError)
        return NextResponse.json(
          {
            error: "Failed to create user record",
            details: insertError.message,
          },
          { status: 500 },
        )
      }

      console.log("API: User record created successfully")
    } catch (insertErr) {
      console.error("API: Exception creating user record:", insertErr)
      return NextResponse.json(
        {
          error: "Exception creating user record",
          details: insertErr instanceof Error ? insertErr.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    // Initialize user progress for all career paths
    const careerPaths = ["engineer", "doctor", "pilot"]
    const progressResults = []

    for (const path of careerPaths) {
      try {
        console.log(`API: Creating progress for ${path}...`)
        const { error: progressError } = await supabaseAdmin.from("user_progress").insert({
          user_id: id,
          career_path: path,
          completed_modules: [],
          current_module: 1,
        })

        if (progressError) {
          console.error(`API: Error creating progress for ${path}:`, progressError)
          progressResults.push({ path, success: false, error: progressError.message })
        } else {
          console.log(`API: Progress created for ${path}`)
          progressResults.push({ path, success: true })
        }
      } catch (progressErr) {
        console.error(`API: Exception creating progress for ${path}:`, progressErr)
        progressResults.push({
          path,
          success: false,
          error: progressErr instanceof Error ? progressErr.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      message: "User record created successfully",
      userCreated: true,
      progressResults,
    })
  } catch (error) {
    console.error("API: Unexpected error in create-user-record:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
