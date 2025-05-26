"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MotionDiv, fadeIn } from "@/components/motion"
import { getCurrentUser } from "@/lib/db-service"
import {
  getAllLearningResources,
  createLearningResource,
  updateLearningResource,
  deleteLearningResource,
  type LearningResource,
} from "@/lib/data-service"
import { Pencil, Trash2, Plus, ArrowLeft, ExternalLink, AlertTriangle, Database } from "lucide-react"

export default function ResourcesManagement() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [resources, setResources] = useState<LearningResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentResource, setCurrentResource] = useState<LearningResource | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    resource_type: "article",
    module_id: 1,
    career_path: "engineer",
  })

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getCurrentUser()
        setCurrentUser(user)

        if (user) {
          const { resources } = await getAllLearningResources({ limit: 100 })
          setResources(resources)
        }
      } catch (error: any) {
        console.error("Error loading resources:", error)
        if (error.message?.includes("does not exist")) {
          setError("Database tables not found. Please set up the database first.")
        } else {
          setError("Failed to load resources. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSetupDatabase = async () => {
    setIsSettingUp(true)
    try {
      const response = await fetch("/api/setup-tables", {
        method: "POST",
      })

      if (response.ok) {
        setError(null)
        // Reload the page to fetch data
        window.location.reload()
      } else {
        throw new Error("Failed to setup database")
      }
    } catch (error) {
      console.error("Error setting up database:", error)
      setError("Failed to setup database. Please try again.")
    } finally {
      setIsSettingUp(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: name === "module_id" ? Number.parseInt(value) : value }))
  }

  const handleAddResource = async () => {
    try {
      const newResource = await createLearningResource(formData)
      setResources((prev) => [...prev, newResource])
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error adding resource:", error)
    }
  }

  const handleEditResource = async () => {
    if (!currentResource) return

    try {
      const updatedResource = await updateLearningResource(currentResource.id as string, formData)
      setResources((prev) => prev.map((r) => (r.id === updatedResource.id ? updatedResource : r)))
      setIsEditDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error updating resource:", error)
    }
  }

  const handleDeleteResource = async () => {
    if (!currentResource) return

    try {
      await deleteLearningResource(currentResource.id as string)
      setResources((prev) => prev.filter((r) => r.id !== currentResource.id))
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting resource:", error)
    }
  }

  const openEditDialog = (resource: LearningResource) => {
    setCurrentResource(resource)
    setFormData({
      title: resource.title,
      description: resource.description,
      url: resource.url,
      resource_type: resource.resource_type,
      module_id: resource.module_id,
      career_path: resource.career_path,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (resource: LearningResource) => {
    setCurrentResource(resource)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      url: "",
      resource_type: "article",
      module_id: 1,
      career_path: "engineer",
    })
    setCurrentResource(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to access the admin dashboard.</p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Physics</span> Digital Learning System
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm">{currentUser.full_name}</span>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Profile</span>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                {currentUser.full_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </div>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <MotionDiv initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link href="/admin" className="mr-4">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Learning Resources</h1>
            </div>

            {!error && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Resource
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add Learning Resource</DialogTitle>
                    <DialogDescription>Create a new learning resource for students.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="url" className="text-right">
                        URL
                      </Label>
                      <Input
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="resource_type" className="text-right">
                        Type
                      </Label>
                      <Select
                        value={formData.resource_type}
                        onValueChange={(value) => handleSelectChange("resource_type", value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="ebook">E-Book</SelectItem>
                          <SelectItem value="interactive">Interactive</SelectItem>
                          <SelectItem value="tool">Tool</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="module_id" className="text-right">
                        Module
                      </Label>
                      <Select
                        value={formData.module_id.toString()}
                        onValueChange={(value) => handleSelectChange("module_id", value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select module" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((id) => (
                            <SelectItem key={id} value={id.toString()}>
                              Module {id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="career_path" className="text-right">
                        Career Path
                      </Label>
                      <Select
                        value={formData.career_path}
                        onValueChange={(value) => handleSelectChange("career_path", value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select career path" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineer">Engineer</SelectItem>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="pilot">Pilot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddResource}>Add Resource</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {error && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Database Setup Required</AlertTitle>
              <AlertDescription className="mt-2">
                {error}
                <div className="mt-4">
                  <Button onClick={handleSetupDatabase} disabled={isSettingUp}>
                    <Database className="mr-2 h-4 w-4" />
                    {isSettingUp ? "Setting up..." : "Setup Database"}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {!error && (
            <Card>
              <CardHeader>
                <CardTitle>All Learning Resources</CardTitle>
              </CardHeader>
              <CardContent>
                {resources.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead>Career Path</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resources.map((resource) => (
                        <TableRow key={resource.id}>
                          <TableCell className="font-medium">{resource.title}</TableCell>
                          <TableCell className="capitalize">{resource.resource_type}</TableCell>
                          <TableCell>Module {resource.module_id}</TableCell>
                          <TableCell className="capitalize">{resource.career_path}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </a>
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(resource)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(resource)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No learning resources found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Edit Learning Resource</DialogTitle>
                <DialogDescription>Update the learning resource details.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-url" className="text-right">
                    URL
                  </Label>
                  <Input
                    id="edit-url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-resource_type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={formData.resource_type}
                    onValueChange={(value) => handleSelectChange("resource_type", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="ebook">E-Book</SelectItem>
                      <SelectItem value="interactive">Interactive</SelectItem>
                      <SelectItem value="tool">Tool</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-module_id" className="text-right">
                    Module
                  </Label>
                  <Select
                    value={formData.module_id.toString()}
                    onValueChange={(value) => handleSelectChange("module_id", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((id) => (
                        <SelectItem key={id} value={id.toString()}>
                          Module {id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-career_path" className="text-right">
                    Career Path
                  </Label>
                  <Select
                    value={formData.career_path}
                    onValueChange={(value) => handleSelectChange("career_path", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select career path" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineer">Engineer</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="pilot">Pilot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditResource}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this learning resource? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteResource}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </MotionDiv>
      </main>
    </div>
  )
}
