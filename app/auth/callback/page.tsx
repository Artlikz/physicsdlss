"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import supabase from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [verifying, setVerifying] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the hash from the URL
        const hash = window.location.hash

        if (hash) {
          // Handle the email verification
          const { error } = await supabase.auth.refreshSession()

          if (error) {
            throw error
          }

          setSuccess(true)

          // Redirect to career paths after a short delay
          setTimeout(() => {
            router.push("/career-paths")
          }, 3000)
        } else {
          setError("Invalid verification link")
        }
      } catch (err) {
        console.error("Error verifying email:", err)
        setError(err instanceof Error ? err.message : "Failed to verify email")
      } finally {
        setVerifying(false)
      }
    }

    handleEmailVerification()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {verifying
              ? "Verifying your email..."
              : success
                ? "Email verified successfully!"
                : "Email verification failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
          {verifying ? (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          ) : success ? (
            <>
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-center text-muted-foreground">
                Your email has been verified. You will be redirected to the career paths page shortly.
              </p>
            </>
          ) : (
            <>
              <XCircle className="h-12 w-12 text-red-500" />
              <p className="text-center text-muted-foreground">{error || "There was an error verifying your email."}</p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {success ? (
            <Button onClick={() => router.push("/career-paths")}>Go to Career Paths</Button>
          ) : !verifying ? (
            <Button onClick={() => router.push("/login-page")}>Try Logging In</Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  )
}
