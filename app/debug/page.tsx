import { SupabaseTest } from "@/components/supabase-test"

export default function DebugPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Debug Tools</h1>
      <SupabaseTest />
    </div>
  )
}
