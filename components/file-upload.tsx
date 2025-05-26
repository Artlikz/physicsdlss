"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, X, CheckCircle, AlertCircle } from "lucide-react"
import supabase from "@/lib/supabase"

interface FileUploadProps {
  onUploadComplete: (url: string) => void
  allowedTypes?: string[]
  maxSizeMB?: number
  bucketName?: string
}

export function FileUpload({
  onUploadComplete,
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"],
  maxSizeMB = 5,
  bucketName = "resources",
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)
    setSuccess(false)

    if (!selectedFile) {
      setFile(null)
      return
    }

    // Check file type
    if (!allowedTypes.includes(selectedFile.type)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`)
      setFile(null)
      return
    }

    // Check file size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`)
      setFile(null)
      return
    }

    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      // Create a unique file name
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${bucketName}/${fileName}`

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(filePath)

      onUploadComplete(publicUrl)
      setSuccess(true)
    } catch (err) {
      console.error("Error uploading file:", err)
      setError(err instanceof Error ? err.message : "Failed to upload file")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setError(null)
    setSuccess(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
        <CardDescription>
          Upload a file to include with your learning resource. Max size: {maxSizeMB}MB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!file ? (
          <div
            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Drag and drop or click to upload</p>
            <p className="text-xs text-muted-foreground">
              Supported formats: {allowedTypes.map((type) => type.split("/")[1]).join(", ")}
            </p>
            <Input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={allowedTypes.join(",")}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between p-2 border rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-primary"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div className="text-sm truncate max-w-[200px]">{file.name}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {error && (
          <div className="flex items-center text-red-500 text-sm mt-2">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center text-green-500 text-sm mt-2">
            <CheckCircle className="h-4 w-4 mr-1" />
            File uploaded successfully!
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} disabled={!file || uploading || success} className="w-full">
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </CardFooter>
    </Card>
  )
}
