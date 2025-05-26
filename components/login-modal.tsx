"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { signIn, getCurrentUser } from "@/lib/db-service"
import { Loader2 } from "lucide-react"
import { EmailVerification } from "@/components/email-verification"

interface LoginModalProps {
  isOpen?: boolean
  onClose?: () => void
  redirectPath: string
  isClient?: boolean
}

export function LoginModal({ isOpen: propIsOpen, onClose, redirectPath, isClient = false }: LoginModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(propIsOpen || false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Email verification state
  const [needsVerification, setNeedsVerification] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState("")

  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsOpen(propIsOpen)
    }
  }, [propIsOpen])

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error checking user:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open && onClose) {
      onClose()
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setIsLoggingIn(true)

    try {
      const { data, error } = await signIn(loginEmail, loginPassword)

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setVerificationEmail(loginEmail)
          setNeedsVerification(true)
        } else {
          throw error
        }
      } else {
        handleOpenChange(false)
        router.push(redirectPath)
        router.refresh()
      }
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(error.message)
      } else {
        setLoginError("An error occurred during login")
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleVerificationComplete = () => {
    handleOpenChange(false)
    router.push(redirectPath)
    router.refresh()
  }

  // If we need to verify email, show the verification component
  if (needsVerification) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <EmailVerification email={verificationEmail} onVerificationComplete={handleVerificationComplete} />
        </DialogContent>
      </Dialog>
    )
  }

  // If user is already logged in and we're not forcing the modal open
  if (user && !loading && !propIsOpen) {
    if (isClient) {
      return (
        <Button size="lg" className="text-lg px-8" onClick={() => router.push(redirectPath)}>
          Continue Learning
        </Button>
      )
    }
    return null
  }

  // For client-side rendering with a button
  if (isClient) {
    return (
      <>
        <Button size="lg" className="text-lg px-8" onClick={() => setIsOpen(true)}>
          Log In
        </Button>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-[425px]">
            <LoginForm />
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // For server-side rendering or when modal is controlled externally
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <LoginForm />
      </DialogContent>
    </Dialog>
  )

  function LoginForm() {
    return (
      <div className="mt-4">
        <DialogHeader>
          <DialogTitle>Login to your account</DialogTitle>
          <DialogDescription>Enter the credentials provided by your teacher or admin.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <input
              id="login-email"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              disabled={isLoggingIn}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <input
              id="login-password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              disabled={isLoggingIn}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {loginError && <div className="text-sm text-red-500">{loginError}</div>}

          <DialogFooter>
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
          </DialogFooter>
        </form>
      </div>
    )
  }
}
