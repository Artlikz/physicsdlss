"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Users, Award, ArrowRight, Stethoscope, Heart, Eye, Zap, Activity } from "lucide-react"

const doctorModules = [
  {
    id: 1,
    title: "Biomechanics and Body Movement",
    description: "Study mechanical principles governing human movement and body mechanics",
    duration: "45 min",
    difficulty: "Beginner",
    icon: Activity,
    topics: ["Kinematics", "Kinetics", "Body Levers", "Center of Gravity"],
  },
  {
    id: 2,
    title: "Medical Imaging and Radiation Physics",
    description: "Understand the physics behind X-rays, CT scans, MRI, and other imaging techniques",
    duration: "60 min",
    difficulty: "Intermediate",
    icon: Eye,
    topics: ["X-ray Physics", "CT Imaging", "MRI Principles", "Radiation Safety"],
  },
  {
    id: 3,
    title: "Fluid Dynamics in Circulatory Systems",
    description: "Explore how blood flows through vessels and the physics of circulation",
    duration: "50 min",
    difficulty: "Intermediate",
    icon: Heart,
    topics: ["Poiseuille's Law", "Bernoulli's Principle", "Vascular Resistance", "Blood Flow"],
  },
  {
    id: 4,
    title: "Optics and Vision Science",
    description: "Learn about light behavior and how the human eye processes visual information",
    duration: "55 min",
    difficulty: "Intermediate",
    icon: Eye,
    topics: ["Refraction", "Lens Systems", "Retinal Physics", "Visual Perception"],
  },
  {
    id: 5,
    title: "Bioelectricity and Neural Signals",
    description: "Understand electrical processes in biological systems and neural communication",
    duration: "65 min",
    difficulty: "Advanced",
    icon: Zap,
    topics: ["Action Potentials", "Ion Channels", "Synaptic Transmission", "Neural Networks"],
  },
  {
    id: 6,
    title: "Thermodynamics in Biological Systems",
    description: "Explore energy transfer and temperature regulation in living organisms",
    duration: "50 min",
    difficulty: "Advanced",
    icon: Stethoscope,
    topics: ["Metabolic Energy", "Heat Transfer", "Temperature Regulation", "Thermal Therapy"],
  },
]

export default function DoctorCareerPath() {
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
            <Stethoscope className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Physics for Medical Professionals
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master the fundamental physics principles that underlie modern medicine, from biomechanics to medical imaging
          and bioelectricity.
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
              <div className="text-2xl font-bold text-blue-600">{doctorModules.length}</div>
              <div className="text-sm text-muted-foreground">Total Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">All Unlocked</div>
              <div className="text-sm text-muted-foreground">Access Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {doctorModules.reduce((total, module) => {
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
        {doctorModules.map((module) => {
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
                <Link href={`/career-paths/doctor/module/${module.id}`} className="w-full">
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
                <li>• Interactive simulations and visualizations</li>
                <li>• Real-world medical case studies</li>
                <li>• Practice problems with detailed solutions</li>
                <li>• Reference formulas and equations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Learning Support</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Step-by-step concept explanations</li>
                <li>• Interactive quizzes and assessments</li>
                <li>• Progress tracking and achievements</li>
                <li>• Community discussion forums</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
