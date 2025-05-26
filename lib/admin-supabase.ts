import { createClient } from "@supabase/supabase-js"

// Use hardcoded fallback values if environment variables are not available
// This ensures the app doesn't crash during development or if env vars are missing
const supabaseUrl = process.env.SUPABASE_URL || "https://uormigwgaiquetcvinak.supabase.co"
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcm1pZ3dnYWlxdWV0Y3ZpbmFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE4MjQzNCwiZXhwIjoyMDYzNzU4NDM0fQ.0kEJwvvK_zPSGBMHy6yvwZvBPBII_xCGreDVyFwQOeaXg4zklNuxrrSVf93wSf5AiPwSRy53xx_hNx8xL1xkPw"

// Log environment variable status for debugging
console.log("Admin Supabase URL from env:", process.env.SUPABASE_URL ? "Available" : "Missing")
console.log(
  "Admin Supabase Service Role Key from env:",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "Available" : "Missing",
)

// Create the admin Supabase client
export const adminSupabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Export as default for backward compatibility
export default adminSupabase
