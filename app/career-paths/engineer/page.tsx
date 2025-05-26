"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Users, Award, ArrowRight, Wrench, Zap, Cog, Thermometer, Waves, Building } from "lucide-react"

const engineerModules = [
  {
    id: 1,
    title: "Introduction to Physics for Engineers",
    description: "Fundamental concepts, measurements, and the scientific method",
    duration: "40 min",
    difficulty: "Beginner",
    icon: Wrench,
    topics: ["SI Units", "Vector Analysis", "Scientific Method", "Problem Solving"],
  },
  {
    id: 2,
    title: "Mechanics: Forces and Motion",
    description: "Newton's laws, forces, and their applications in engineering",
    duration: "55 min",
    difficulty: "Intermediate",
    icon: Cog,
    topics: ["Newton's Laws", "Force Analysis", "Friction", "Work & Energy"],
  },
  {
    id: 3,
    title: "Thermodynamics and Heat Transfer",
    description: "Energy systems, heat engines, and thermal processes",
    duration: "60 min",
    difficulty: "Intermediate",
    icon: Thermometer,
    topics: ["Laws of Thermodynamics", "Heat Engines", "Thermal Processes", "Heat Transfer"],
  },
  {
    id: 4,
    title: "Electricity and Magnetism",
    description: "Electric circuits, electromagnetic fields, and power systems",
    duration: "65 min",
    difficulty: "Advanced",
    icon: Zap,
    topics: ["Electric Circuits", "Electromagnetic Fields", "Power Systems", "Motors & Generators"],
  },
  {
    id: 5,
    title: "Wave Physics and Acoustics",
    description: "Wave propagation, sound, and vibration analysis",
    duration: "50 min",
    difficulty: "Advanced",
    icon: Waves,
    topics: ["Wave Properties", "Sound Waves", "Vibration Analysis", "Acoustic Design"],
  },
  {
    id: 6,
    title: "Materials Science and Structures",
    description: "Material properties, stress analysis, and structural design",
    duration: "55 min",
    difficulty: "Advanced",
    icon: Building,
    topics: ["Material Properties", "Stress & Strain", "Structural Analysis", "Design Principles"],
  },
]

export default function EngineerCareerPath() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-orange-100 rounded-full">
            <Wrench className="h-12 w-12 text-orange-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Physics for Engineers
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master the fundamental physics principles that form the foundation of engineering design, analysis, and
          innovation.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{engineerModules.length}</div>
              <div className="text-sm text-muted-foreground">Total Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">All Unlocked</div>
              <div className="text-sm text-muted-foreground">Access Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {engineerModules.reduce((total, module) => {
                  const duration = Number.parseInt(module.duration)
                  return total + duration
                }, 0)}{" "}
                min
              </div>
              <div className="text-sm text-muted-foreground">Total Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {engineerModules.map((module) => {
          const IconComponent = module.icon

          return (
            <Card
              key={module.id}
              className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-200"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <IconComponent className="h-6 w-6 text-orange-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {module.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{module.title}</CardTitle>
                <CardDescription className="text-sm">{module.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {module.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {module.topics.length} topics
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Key Topics:</div>
                  <div className="flex flex-wrap gap-1">
                    {module.topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Link href={`/career-paths/engineer/module/${module.id}`} className="w-full">
                  <Button className="w-full group-hover:bg-orange-600 transition-colors">
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Additional Resources */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Study Materials</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Engineering problem-solving exercises</li>
                <li>• Real-world engineering case studies</li>
                <li>• Interactive simulations and calculators</li>
                <li>• Design project examples</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Learning Support</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Step-by-step solution methods</li>
                <li>• Interactive quizzes and assessments</li>
                <li>• Progress tracking and achievements</li>
                <li>• Engineering community discussions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
