"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import supabase from "@/lib/supabase"

export function SupabaseTest() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [details, setDetails] = useState("")

  const testConnection = async () => {
    setStatus("loading")
    setMessage("")
    setDetails("")

    try {
      // Log environment variables (without exposing sensitive data)
      console.log("NEXT_PUBLIC_SUPABASE_URL available:", !!process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY available:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

      // Simple ping test
      const { data, error } = await supabase.from("users").select("count").limit(1)

      if (error) {
        throw error
      }

      setStatus("success")
      setMessage("Successfully connected to Supabase!")
      setDetails(`Response: ${JSON.stringify(data)}`)
    } catch (error) {
      console.error("Supabase connection test failed:", error)
      setStatus("error")
      setMessage("Failed to connect to Supabase")
      setDetails(error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>Test your connection to Supabase</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "loading" && <p className="text-amber-600">Testing connection...</p>}
        {status === "success" && <p className="text-green-600">{message}</p>}
        {status === "error" && (
          <div className="text-red-600">
            <p>{message}</p>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">{details}</pre>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={testConnection} disabled={status === "loading"}>
          {status === "loading" ? "Testing..." : "Test Connection"}
        </Button>
      </CardFooter>
    </Card>
  )
}
