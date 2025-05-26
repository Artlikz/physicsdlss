"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MotionDiv, fadeIn } from "@/components/motion"
import { RecommendedResources } from "@/components/recommended-resources"

interface ModuleConceptProps {
  concept: {
    summary: string
    keyPoints: string[]
    formulas: { name: string; formula: string }[]
    applications: string[]
  }
  moduleId: number
  careerPath: string
}

export function ModuleConcept({ concept, moduleId, careerPath }: ModuleConceptProps) {
  const [activeTab, setActiveTab] = useState("summary")

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <MotionDiv initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Concept Overview</CardTitle>
              <CardDescription>Master the fundamental concepts and principles</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="keyPoints">Key Points</TabsTrigger>
                  <TabsTrigger value="formulas">Formulas</TabsTrigger>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="mt-4">
                  <div className="prose max-w-none">
                    {concept.summary.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="mb-4 text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="keyPoints" className="mt-4">
                  <ul className="space-y-3">
                    {concept.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start">
                        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary h-6 w-6 mr-2 mt-0.5 text-sm">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="formulas" className="mt-4">
                  <div className="space-y-4">
                    {concept.formulas.map((formula, i) => (
                      <div key={i} className="p-4 border rounded-md">
                        <h3 className="font-medium mb-2">{formula.name}</h3>
                        <div className="bg-secondary/30 p-3 rounded-md text-center">{formula.formula}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="applications" className="mt-4">
                  <ul className="space-y-3">
                    {concept.applications.map((application, i) => (
                      <li key={i} className="flex items-start">
                        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary h-6 w-6 mr-2 mt-0.5 text-sm">
                          •
                        </span>
                        <span className="text-muted-foreground">{application}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </MotionDiv>
      </div>

      <div>
        <MotionDiv initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}>
          <RecommendedResources moduleId={moduleId} careerPath={careerPath} />
        </MotionDiv>
      </div>
    </div>
  )
}
