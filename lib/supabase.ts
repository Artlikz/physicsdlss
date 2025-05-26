import { createClient } from "@supabase/supabase-js"

// Use hardcoded fallback values if environment variables are not available
// This ensures the app doesn't crash during development or if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uormigwgaiquetcvinak.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcm1pZ3dnYWlxdWV0Y3ZpbmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxODI0MzQsImV4cCI6MjA2Mzc1ODQzNH0.PzAZa98EZDt0YcsUgX0oz-CIUBlX9H2jeYedXeuqBo0"

// Log environment variable status for debugging
console.log("Supabase URL from env:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Available" : "Missing")
console.log("Supabase Anon Key from env:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Available" : "Missing")

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
