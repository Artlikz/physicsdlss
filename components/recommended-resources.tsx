"use client"

import { useEffect, useState } from "react"
import { ExternalLink, BookOpen, Video, FileText, Lightbulb, PenToolIcon as Tool } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getRecommendedResources } from "@/lib/db-service"
import { MotionUl, MotionLi, staggerContainer, slideIn } from "@/components/motion"
import { Skeleton } from "@/components/ui/skeleton"

interface Resource {
  id: string
  title: string
  description: string
  url: string
  resource_type: string
}

const resourceIcons: Record<string, any> = {
  ebook: BookOpen,
  video: Video,
  article: FileText,
  interactive: Lightbulb,
  tool: Tool,
}

export function RecommendedResources({ moduleId, careerPath }: { moduleId: number; careerPath: string }) {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadResources() {
      try {
        const data = await getRecommendedResources(moduleId, careerPath)
        setResources(data)
      } catch (error) {
        console.error("Error loading resources:", error)
      } finally {
        setLoading(false)
      }
    }

    loadResources()
  }, [moduleId, careerPath])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommended Resources</CardTitle>
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recommended Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <MotionUl initial="hidden" animate="visible" variants={staggerContainer} className="space-y-3">
          {resources.length > 0 ? (
            resources.map((resource) => {
              const Icon = resourceIcons[resource.resource_type] || BookOpen

              return (
                <MotionLi key={resource.id} variants={slideIn}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm flex-1">{resource.title}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </MotionLi>
              )
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">
              No resources available for this module yet.
            </p>
          )}

          <MotionLi variants={slideIn}>
            <Button variant="link" size="sm" className="p-0 h-auto text-primary" asChild>
              <a href="/resources">View all learning resources</a>
            </Button>
          </MotionLi>
        </MotionUl>
      </CardContent>
    </Card>
  )
}
