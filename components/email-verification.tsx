"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Mail, AlertTriangle, CheckCircle } from "lucide-react"
import supabase from "@/lib/supabase"
import { getCurrentUser } from "@/lib/db-service"

interface EmailVerificationProps {
  email: string
  onVerificationComplete?: () => void
}

export function EmailVerification({ email, onVerificationComplete }: EmailVerificationProps) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)

  const sendVerificationEmail = async () => {
    setSending(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      })

      if (error) throw error

      setSent(true)
    } catch (err) {
      console.error("Error sending verification email:", err)
      setError(err instanceof Error ? err.message : "Failed to send verification email")
    } finally {
      setSending(false)
    }
  }

  const checkVerificationStatus = async () => {
    setVerifying(true)
    setError(null)

    try {
      // First refresh the session
      await supabase.auth.refreshSession()

      // Then check if user is logged in
      const user = await getCurrentUser()

      if (user) {
        setVerified(true)
        if (onVerificationComplete) {
          onVerificationComplete()
        }
      } else {
        setError("Email not verified yet. Please check your inbox and click the verification link.")
      }
    } catch (err) {
      console.error("Error checking verification status:", err)
      setError(err instanceof Error ? err.message : "Failed to check verification status")
    } finally {
      setVerifying(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Email Verification Required</CardTitle>
        <CardDescription>Please verify your email address to continue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {verified ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">Email Verified</AlertTitle>
            <AlertDescription className="text-green-600">Your email has been successfully verified.</AlertDescription>
          </Alert>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="rounded-full bg-primary/10 p-4 mx-auto w-fit">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground">
              We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to
              verify your email address.
            </p>
            <p className="text-sm text-muted-foreground">If you don't see the email, check your spam folder.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {!verified && (
          <>
            <Button className="w-full" onClick={checkVerificationStatus} disabled={verifying}>
              {verifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "I've verified my email"
              )}
            </Button>

            <Button variant="outline" className="w-full" onClick={sendVerificationEmail} disabled={sending || sent}>
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : sent ? (
                "Verification email sent"
              ) : (
                "Resend verification email"
              )}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
