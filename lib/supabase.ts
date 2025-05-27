import { createClient } from "@supabase/supabase-js"

// Use hardcoded fallback values if environment variables are not available
// This ensures the app doesn't crash during development or if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jmpqvxqurzeshrkrfmtk.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptcHF2eHF1cnplc2hya3JmbXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyOTMyNDIsImV4cCI6MjA2MDg2OTI0Mn0.vOrxrliRQ_heD8CmpuT_eSuebdUlnUXzYmYkUaAG9v4"

// Log environment variable status for debugging
console.log("Supabase URL from env:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Available" : "Missing")
console.log("Supabase Anon Key from env:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Available" : "Missing")

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
