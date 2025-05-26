"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MotionDiv, fadeIn } from "@/components/motion"
import { ModuleConcept } from "@/components/module-concept"
import { ModuleQuiz } from "@/components/module-quiz"
import { ModuleActivities } from "@/components/module-activities"
import { ArrowLeft, BookOpen, Brain, Activity } from "lucide-react"
import { getCurrentUser, getUserProgress } from "@/lib/db-service"
import { getModuleContent } from "@/lib/module-content"
import Link from "next/link"

export default function PilotModulePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const moduleId = Number.parseInt(params.id)
  const [user, setUser] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("concept")
  const [loading, setLoading] = useState(true)
  const [moduleContent, setModuleContent] = useState<any>(null)

  const moduleTitle = getModuleTitle(moduleId)

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/login-page?redirect=/pilot")
          return
        }

        setUser(currentUser)
        const userProgress = await getUserProgress(currentUser.id, "pilot")
        setProgress(userProgress)

        // Load module content
        const content = getModuleContent("pilot", moduleId)
        setModuleContent(content)

        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [router, moduleId])

  function getModuleTitle(id: number): string {
    const titles = {
      1: "Principles of Flight and Aerodynamics",
      2: "Atmospheric Physics and Weather Patterns",
      3: "Navigation Systems and Principles",
      4: "Aircraft Performance and Limitations",
    }
    return titles[id as keyof typeof titles] || "Unknown Module"
  }

  if (loading) {
    return (
      <div className="container py-8 px-4 mx-auto max-w-6xl">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!moduleContent) {
    return (
      <div className="container py-8 px-4 mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested module content is not available.</p>
          <Link href="/pilot">
            <Button>Return to Course</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4 mx-auto max-w-6xl">
      <MotionDiv initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
        <div className="flex items-center mb-6">
          <Link href="/pilot" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Module {moduleId}</Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">Pilot Path</Badge>
            </div>
            <h1 className="text-3xl font-bold gradient-heading">{moduleTitle}</h1>
            <p className="text-lg text-muted-foreground mt-2">Master the physics principles essential for aviation</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Learning Objectives</CardTitle>
            <CardDescription>What you'll learn in this module</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-sm">Understand core concepts</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span className="text-sm">Apply knowledge through quizzes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-primary" />
                <span className="text-sm">Practice with STEM activities</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="concept">Concept Learning</TabsTrigger>
          <TabsTrigger value="quiz">Knowledge Assessment</TabsTrigger>
          <TabsTrigger value="activities">STEM Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="concept" className="space-y-8">
          <ModuleConcept concept={moduleContent.concept} moduleId={moduleId} careerPath="pilot" />
        </TabsContent>

        <TabsContent value="quiz" className="space-y-8">
          <ModuleQuiz quiz={moduleContent.quiz} moduleId={moduleId} careerPath="pilot" userId={user?.id} />
        </TabsContent>

        <TabsContent value="activities" className="space-y-8">
          <ModuleActivities activities={moduleContent.activities} moduleId={moduleId} careerPath="pilot" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
