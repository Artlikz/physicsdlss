"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MotionDiv, fadeIn } from "@/components/motion"
import { Lock, CheckCircle2, ArrowRight } from "lucide-react"
import { getCurrentUser, getUserProgress, isModuleUnlocked } from "@/lib/db-service"

// Define the modules for the pilot path
const pilotModules = [
  {
    id: 1,
    title: "Principles of Flight and Aerodynamics",
    description: "Fundamental forces and principles that enable aircraft flight",
    topics: [
      "Four Forces of Flight",
      "Bernoulli's Principle",
      "Airfoil Design",
      "Angle of Attack",
      "Lift-to-Drag Ratio",
    ],
    duration: "45 min",
  },
  {
    id: 2,
    title: "Atmospheric Physics and Weather Patterns",
    description: "Understanding atmospheric conditions and their impact on flight",
    topics: ["Atmospheric Layers", "Pressure Systems", "Wind Patterns", "Weather Fronts", "Coriolis Effect"],
    duration: "60 min",
  },
  {
    id: 3,
    title: "Navigation Systems and Principles",
    description: "Modern navigation technologies and traditional navigation methods",
    topics: ["GPS and GNSS", "Inertial Navigation", "Radio Navigation", "Dead Reckoning", "Route Planning"],
    duration: "55 min",
  },
  {
    id: 4,
    title: "Aircraft Performance and Limitations",
    description: "Understanding aircraft capabilities and operational boundaries",
    topics: [
      "Takeoff/Landing Performance",
      "Climb Performance",
      "Range and Endurance",
      "Weight Limitations",
      "Environmental Factors",
    ],
    duration: "50 min",
  },
]

export default function PilotPathPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [moduleStatus, setModuleStatus] = useState<{ [key: number]: { isCompleted: boolean; isUnlocked: boolean } }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
          router.push("/login-page?redirect=/pilot")
          return
        }

        setUser(currentUser)

        // Get user progress
        const userProgress = await getUserProgress(currentUser.id, "pilot")
        setProgress(userProgress)

        // Check module status
        const statusMap: { [key: number]: { isCompleted: boolean; isUnlocked: boolean } } = {}

        for (const module of pilotModules) {
          const isCompleted = userProgress?.completed_modules?.includes(module.id) || false
          const isUnlocked = await isModuleUnlocked(currentUser.id, "pilot", module.id)

          statusMap[module.id] = { isCompleted, isUnlocked }
        }

        setModuleStatus(statusMap)
        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <div className="container py-8 px-4 mx-auto max-w-6xl">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4 mx-auto max-w-6xl">
      <MotionDiv initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
        <h1 className="text-4xl font-bold mb-4 gradient-heading">Physics for Pilots</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Master the physics principles essential for aviation through our specialized modules designed for pilots and
          aviation professionals.
        </p>
      </MotionDiv>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Learning Modules</h2>
          <div className="space-y-6">
            {pilotModules.map((module) => {
              const status = moduleStatus[module.id] || { isCompleted: false, isUnlocked: module.id === 1 }
              const isCurrent = progress?.current_module === module.id

              return (
                <MotionDiv
                  key={module.id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  transition={{ delay: 0.1 * module.id }}
                >
                  <Card className={`module-card ${!status.isUnlocked ? "locked" : ""}`}>
                    {isCurrent && (
                      <div className="absolute -left-2 -top-2">
                        <Badge className="bg-primary text-white">Current</Badge>
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                        <div className="flex items-center">
                          {status.isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          ) : !status.isUnlocked ? (
                            <Lock className="h-6 w-6 text-muted-foreground" />
                          ) : null}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm">Topics Covered:</h3>
                        <div className="flex flex-wrap gap-2">
                          {module.topics.map((topic, i) => (
                            <Badge key={i} variant="outline" className="bg-secondary/50">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">Estimated duration: {module.duration}</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {status.isUnlocked ? (
                        <Link href={`/pilot/module/${module.id}`} className="w-full">
                          <Button className="w-full">
                            {status.isCompleted ? "Review Module" : "Start Module"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled className="w-full">
                          Locked
                          <Lock className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </MotionDiv>
              )
            })}
          </div>
        </div>

        <div className="space-y-8">
          <MotionDiv initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Completion</span>
                      <span className="text-sm text-muted-foreground">
                        {progress?.completed_modules?.length || 0}/{pilotModules.length} modules
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${((progress?.completed_modules?.length || 0) / pilotModules.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        </div>
      </div>
    </div>
  )
}
