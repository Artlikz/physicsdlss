"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Users, Award, ArrowRight, Plane, Wind, Navigation, Gauge, Radio, Shield } from "lucide-react"

const pilotModules = [
  {
    id: 1,
    title: "Principles of Flight and Aerodynamics",
    description: "Master the fundamental forces of flight: lift, weight, thrust, and drag",
    duration: "50 min",
    difficulty: "Beginner",
    icon: Plane,
    topics: ["Four Forces", "Bernoulli's Principle", "Angle of Attack", "Airfoils"],
  },
  {
    id: 2,
    title: "Atmospheric Physics and Weather Patterns",
    description: "Understand atmospheric structure, pressure systems, and weather phenomena",
    duration: "55 min",
    difficulty: "Intermediate",
    icon: Wind,
    topics: ["Atmospheric Layers", "Pressure Systems", "Wind Patterns", "Weather Fronts"],
  },
  {
    id: 3,
    title: "Navigation Systems and Principles",
    description: "Learn GPS, inertial navigation, and traditional navigation methods",
    duration: "60 min",
    difficulty: "Intermediate",
    icon: Navigation,
    topics: ["GPS Technology", "Inertial Navigation", "Dead Reckoning", "Radio Navigation"],
  },
  {
    id: 4,
    title: "Aircraft Performance and Limitations",
    description: "Study aircraft performance parameters and operational limitations",
    duration: "45 min",
    difficulty: "Intermediate",
    icon: Gauge,
    topics: ["Takeoff Performance", "Climb Rate", "Range & Endurance", "Weight & Balance"],
  },
  {
    id: 5,
    title: "Radio Communication and Electronics",
    description: "Understand radio wave propagation and aviation communication systems",
    duration: "40 min",
    difficulty: "Advanced",
    icon: Radio,
    topics: ["Radio Waves", "Communication Systems", "Radar Principles", "Electronic Navigation"],
  },
  {
    id: 6,
    title: "Aviation Safety and Human Factors",
    description: "Explore safety systems, risk management, and human performance in aviation",
    duration: "50 min",
    difficulty: "Advanced",
    icon: Shield,
    topics: ["Safety Systems", "Risk Assessment", "Human Factors", "Emergency Procedures"],
  },
]

export default function PilotCareerPath() {
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
          <div className="p-4 bg-blue-100 rounded-full">
            <Plane className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Physics for Aviation Professionals
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master the physics principles essential for aviation, from aerodynamics and atmospheric science to navigation
          and aircraft performance.
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
              <div className="text-2xl font-bold text-blue-600">{pilotModules.length}</div>
              <div className="text-sm text-muted-foreground">Total Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">All Unlocked</div>
              <div className="text-sm text-muted-foreground">Access Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {pilotModules.reduce((total, module) => {
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
        {pilotModules.map((module) => {
          const IconComponent = module.icon

          return (
            <Card
              key={module.id}
              className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <IconComponent className="h-6 w-6 text-blue-600" />
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
                <Link href={`/career-paths/pilot/module/${module.id}`} className="w-full">
                  <Button className="w-full group-hover:bg-blue-600 transition-colors">
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
                <li>• Flight simulation exercises</li>
                <li>• Real aviation case studies</li>
                <li>• Interactive weather pattern analysis</li>
                <li>• Navigation calculation tools</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Learning Support</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Step-by-step flight physics explanations</li>
                <li>• Interactive quizzes and assessments</li>
                <li>• Progress tracking and achievements</li>
                <li>• Aviation community discussions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
