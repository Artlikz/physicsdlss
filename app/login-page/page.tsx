"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn, getCurrentUser } from "@/lib/db-service"
import { Loader2, Mail, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import supabase from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect") || "/career-paths"
  const justRegistered = searchParams.get("registered") === "true"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser()
      if (user) {
        // User is already logged in, redirect to the specified path
        router.push(redirectPath)
      }
    }

    checkAuth()
  }, [router, redirectPath])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setEmailNotConfirmed(false)
    setIsLoggingIn(true)

    try {
      const { data, error } = await signIn(email, password)

      if (error) {
        if (error.code === "email_not_confirmed") {
          setEmailNotConfirmed(true)
        } else {
          throw error
        }
      } else {
        // Force a page reload to ensure the auth state is updated
        window.location.href = redirectPath
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An error occurred during login")
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleResendVerification = async () => {
    setIsResendingEmail(true)
    setResendSuccess(false)
    setError("")

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      setResendSuccess(true)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Failed to resend verification email")
      }
    } finally {
      setIsResendingEmail(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 font-bold text-xl">
        <span className="text-primary">STEM</span> School
      </Link>

      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {justRegistered && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertDescription className="text-green-600">
                Registration successful! Please check your email to verify your account before logging in.
              </AlertDescription>
            </Alert>
          )}

          {emailNotConfirmed ? (
            <div className="space-y-4">
              <div className="mx-auto rounded-full bg-amber-100 p-3 w-fit">
                <Mail className="h-8 w-8 text-amber-600" />
              </div>
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-700">Email not verified</AlertTitle>
                <AlertDescription className="text-amber-600">
                  Please verify your email address before logging in. Check your inbox for a verification link.
                </AlertDescription>
              </Alert>

              {resendSuccess ? (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-600">
                    Verification email sent! Please check your inbox.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={handleResendVerification}
                    disabled={isResendingEmail}
                    className="mt-2"
                  >
                    {isResendingEmail ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Resend verification email"
                    )}
                  </Button>
                </div>
              )}

              {error && <div className="text-sm text-red-500 p-2 bg-red-50 border border-red-200 rounded">{error}</div>}
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {error && <div className="text-sm text-red-500 p-2 bg-red-50 border border-red-200 rounded">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-muted-foreground mt-2">
            Contact your teacher or admin if you need an account.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
