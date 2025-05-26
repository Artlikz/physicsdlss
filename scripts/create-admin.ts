// This is a script to create the initial admin user
// It can be run with: npx tsx scripts/create-admin.ts

import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import readline from "readline"

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function createAdminUser() {
  return new Promise((resolve) => {
    rl.question("Enter admin email: ", async (email) => {
      rl.question("Enter admin password: ", async (password) => {
        rl.question("Enter admin full name: ", async (fullName) => {
          try {
            // Create the user in Auth
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
              email,
              password,
              email_confirm: true,
              user_metadata: { full_name: fullName, role: "admin" },
            })

            if (authError) {
              console.error("Error creating admin user:", authError)
              resolve(false)
              return
            }

            // Create user record in the users table
            if (authData.user) {
              const newUser = {
                id: authData.user.id,
                email: email,
                full_name: fullName,
                role: "admin",
              }

              const { error: insertError } = await supabase.from("users").insert(newUser)

              if (insertError) {
                console.error("Error creating admin user record:", insertError)
                resolve(false)
                return
              }

              console.log("Admin user created successfully!")
              console.log(`Email: ${email}`)
              console.log(`Full Name: ${fullName}`)
              console.log(`User ID: ${authData.user.id}`)
              resolve(true)
            }
          } catch (error) {
            console.error("Unexpected error creating admin user:", error)
            resolve(false)
          }
        })
      })
    })
  })
}

async function main() {
  try {
    await createAdminUser()
  } catch (error) {
    console.error("Error:", error)
  } finally {
    rl.close()
  }
}

main()
