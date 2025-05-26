"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page since registration is now admin-only
    router.push("/login")
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Registration is now managed by administrators. Redirecting to login...</p>
    </div>
  )
}
