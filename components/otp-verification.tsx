"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface OTPVerificationProps {
  email: string
  otp?: string // For development purposes
  onVerificationComplete: () => void
  onResendOTP: () => Promise<void>
}

export function OTPVerification({ email, otp, onVerificationComplete, onResendOTP }: OTPVerificationProps) {
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsVerifying(true)

    try {
      // For development purposes, if we have an OTP from the parent component,
      // we'll just check if the entered code matches
      if (otp) {
        if (verificationCode === otp) {
          console.log("OTP verified successfully (development mode)")
          setTimeout(() => {
            onVerificationComplete()
          }, 1000)
          return
        } else {
          throw new Error("Invalid verification code")
        }
      } else {
        // If no OTP was provided, just accept any code in development mode
        if (verificationCode.length === 6) {
          console.log("Development mode: Accepting any 6-digit code")
          setTimeout(() => {
            onVerificationComplete()
          }, 1000)
          return
        } else {
          throw new Error("Please enter a 6-digit verification code")
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An error occurred during verification")
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOTP = async () => {
    setIsResending(true)
    setError("")

    try {
      await onResendOTP()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Failed to resend verification code")
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
        <CardDescription>
          We've sent a verification code to {email}. Please enter it below.
          {otp && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
              <strong>Development mode:</strong> Use code <span className="font-mono">{otp}</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium">
              Verification Code
            </label>
            <input
              id="otp"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              placeholder="Enter 6-digit code"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <Button type="submit" className="w-full" disabled={isVerifying}>
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-sm text-muted-foreground mt-2">
          Didn't receive a code?{" "}
          <button
            onClick={handleResendOTP}
            disabled={isResending}
            className="text-primary underline-offset-4 hover:underline"
          >
            {isResending ? "Resending..." : "Resend"}
          </button>
        </div>
      </CardFooter>
    </Card>
  )
}
