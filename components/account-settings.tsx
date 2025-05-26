"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertTriangle, Check } from "lucide-react"
import supabase from "@/lib/supabase"

interface AccountSettingsProps {
  user: {
    id: string
    email: string
    full_name: string
  }
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [setupComplete, setSetupComplete] = useState(false)

  // Add state for name change
  const [newName, setNewName] = useState(user.full_name)
  const [isUpdatingName, setIsUpdatingName] = useState(false)
  const [nameUpdateSuccess, setNameUpdateSuccess] = useState(false)
  const [nameUpdateError, setNameUpdateError] = useState<string | null>(null)

  const setupDeleteProcedure = async () => {
    try {
      const response = await fetch("/api/admin/setup-delete-procedure")
      const result = await response.json()

      if (!response.ok) {
        console.error("Setup error:", result)
        setDebugInfo(JSON.stringify(result, null, 2))
        return false
      }

      setSetupComplete(true)
      return true
    } catch (error) {
      console.error("Error setting up procedure:", error)
      return false
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    setError(null)
    setDebugInfo(null)
    setSuccess(null)

    try {
      // First, ensure the delete procedure is set up
      if (!setupComplete) {
        const setupSuccess = await setupDeleteProcedure()
        if (!setupSuccess) {
          setError("Failed to set up deletion procedure")
          setIsDeleting(false)
          return
        }
      }

      console.log("Starting account deletion process...")

      // Use the force delete API route
      const response = await fetch("/api/admin/force-delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      // Log the full result for debugging
      console.log("API response:", result)
      setDebugInfo(JSON.stringify(result, null, 2))

      if (!response.ok && !result.success) {
        throw new Error(result.error || "Failed to delete account")
      }

      // Handle success with warnings
      if (result.warnings && result.warnings.length > 0) {
        setSuccess(
          `Account handled successfully with some warnings. You may need to contact support for complete deletion.`,
        )
      } else {
        setSuccess("Account deleted successfully")
      }

      // Sign out after successful deletion
      try {
        await supabase.auth.signOut()
      } catch (signOutError) {
        console.error("Error signing out:", signOutError)
      }

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 3000)
    } catch (err) {
      console.error("Error during account deletion:", err)
      setError(err instanceof Error ? err.message : "An error occurred while deleting your account")
      setIsDeleting(false)
    }
  }

  const handleManualSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Add the function to update user name
  const handleUpdateName = async () => {
    if (!newName || newName.trim() === "") {
      setNameUpdateError("Name cannot be empty")
      return
    }

    setIsUpdatingName(true)
    setNameUpdateError(null)
    setNameUpdateSuccess(false)

    try {
      // Update the user's name in the database
      const { error } = await supabase.from("users").update({ full_name: newName.trim() }).eq("id", user.id)

      if (error) {
        console.error("Error updating name:", error)
        setNameUpdateError(error.message || "Failed to update name")
        setIsUpdatingName(false)
        return
      }

      // Also update the user metadata in auth
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: newName.trim() },
      })

      if (authError) {
        console.error("Error updating auth metadata:", authError)
        // Continue anyway as the main user record was updated
      }

      setNameUpdateSuccess(true)
      setIsUpdatingName(false)

      // Refresh the page after a short delay to show the updated name
      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error("Error updating name:", err)
      setNameUpdateError(err instanceof Error ? err.message : "An error occurred while updating your name")
      setIsUpdatingName(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account settings and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add name update form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="flex space-x-2">
                <Input
                  id="fullName"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter your full name"
                  disabled={isUpdatingName}
                />
                <Button
                  onClick={handleUpdateName}
                  disabled={isUpdatingName || newName.trim() === user.full_name}
                  size="sm"
                >
                  {isUpdatingName ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
                </Button>
              </div>
              {nameUpdateError && <p className="text-sm text-red-500 mt-1">{nameUpdateError}</p>}
              {nameUpdateSuccess && (
                <div className="flex items-center text-sm text-green-500 mt-1">
                  <Check className="h-4 w-4 mr-1" />
                  Name updated successfully
                </div>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove all your data from
                our servers.
              </DialogDescription>
            </DialogHeader>

            {success && (
              <div className="bg-green-50 border border-green-200 rounded p-3 text-green-600 text-sm flex items-start">
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-red-600 text-sm flex items-start">
                <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {debugInfo && (
              <div className="bg-gray-50 border border-gray-200 rounded p-3 text-gray-600 text-xs mt-3">
                <p className="font-medium mb-1">Debug Information:</p>
                <pre className="whitespace-pre-wrap overflow-auto max-h-40">{debugInfo}</pre>
              </div>
            )}

            <DialogFooter>
              {success ? (
                <Button onClick={handleManualSignOut}>Sign Out Now</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setShowConfirmation(false)} disabled={isDeleting}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Account"
                    )}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
