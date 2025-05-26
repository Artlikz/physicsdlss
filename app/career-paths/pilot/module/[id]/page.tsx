import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ModuleConcept } from "@/components/module-concept"
import { ModuleQuiz } from "@/components/module-quiz"
import { ModuleActivities } from "@/components/module-activities"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Brain, Zap } from "lucide-react"
import Link from "next/link"
import { getModuleContent } from "@/lib/module-content"

interface PageProps {
  params: {
    id: string
  }
}

export default async function PilotModulePage({ params }: PageProps) {
  const moduleId = Number.parseInt(params.id)
  const moduleContent = getModuleContent("pilot", moduleId)

  if (!moduleContent) {
    notFound()
  }

  const moduleTitle = getModuleTitle(moduleId)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/career-paths/pilot" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {moduleTitle}
          </h1>
          <p className="text-muted-foreground">Physics for Aviation Professionals</p>
        </div>
      </div>

      <Tabs defaultValue="concept" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="concept" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Concept
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Quiz
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Activities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="concept">
          <Suspense fallback={<div>Loading concept...</div>}>
            <ModuleConcept concept={moduleContent.concept} moduleId={moduleId} careerPath="pilot" />
          </Suspense>
        </TabsContent>

        <TabsContent value="quiz">
          <Suspense fallback={<div>Loading quiz...</div>}>
            <ModuleQuiz quiz={moduleContent.quiz} moduleId={moduleId} careerPath="pilot" userId="demo-user" />
          </Suspense>
        </TabsContent>

        <TabsContent value="activities">
          <Suspense fallback={<div>Loading activities...</div>}>
            <ModuleActivities activities={moduleContent.activities} moduleId={moduleId} careerPath="pilot" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getModuleTitle(moduleId: number): string {
  const titles: Record<number, string> = {
    1: "Principles of Flight and Aerodynamics",
    2: "Atmospheric Physics and Weather Patterns",
    3: "Navigation Systems and Principles",
    4: "Aircraft Performance and Limitations",
    5: "Radio Communication and Electronics",
    6: "Aviation Safety and Human Factors",
  }
  return titles[moduleId] || `Module ${moduleId}`
}
