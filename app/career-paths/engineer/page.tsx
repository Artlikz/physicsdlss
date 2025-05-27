"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MotionDiv, fadeIn, popIn, staggerContainer } from "@/components/motion"
import { ArrowLeft, BookOpen, Clock, Lock, CheckCircle, Star, Trophy } from "lucide-react"
import { getCurrentUser, getUserProgress, isModuleUnlocked } from "@/lib/db-service"

const modules = [
  {
    id: 1,
    title: "Introduction to Physics for Engineers",
    description: "Fundamental concepts, units, measurements, and the scientific method in engineering.",
    duration: "45 min",
    difficulty: "Beginner",
    topics: ["SI Units", "Measurement", "Scientific Method", "Error Analysis"],
  },
  {
    id: 2,
    title: "Mechanics and Statics",
    description: "Forces, equilibrium, moments, and structural analysis for engineering applications.",
    duration: "60 min",
    difficulty: "Intermediate",
    topics: ["Force Analysis", "Equilibrium", "Moments", "Trusses"],
  },
  {
    id: 3,
    title: "Dynamics and Motion",
    description: "Kinematics, Newton's laws, and motion analysis in engineering systems.",
    duration: "55 min",
    difficulty: "Intermediate",
    topics: ["Kinematics", "Newton's Laws", "Projectile Motion", "Circular Motion"],
  },
  {
    id: 4,
    title: "Energy and Work",
    description: "Work-energy theorem, conservation of energy, and power in mechanical systems.",
    duration: "50 min",
    difficulty: "Intermediate",
    topics: ["Work", "Kinetic Energy", "Potential Energy", "Power"],
  },
  {
    id: 5,
    title: "Thermodynamics Fundamentals",
    description: "Heat, temperature, thermal properties, and the laws of thermodynamics.",
    duration: "65 min",
    difficulty: "Advanced",
    topics: ["Heat Transfer", "First Law", "Second Law", "Entropy"],
  },
  {
    id: 6,
    title: "Electricity and Magnetism",
    description: "Electric circuits, magnetic fields, and electromagnetic applications in engineering.",
    duration: "70 min",
    difficulty: "Advanced",
    topics: ["Ohm's Law", "Circuits", "Magnetic Fields", "Induction"],
  },
]

export default function EngineerPage() {
  const [user, setUser] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [moduleUnlockStatus, setModuleUnlockStatus] = useState<{ [key: number]: boolean }>({})
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setUser(currentUser)

          try {
            const userProgress = await getUserProgress(currentUser.id, "engineer")
            setProgress(userProgress)

            // Check unlock status for each module
            const unlockStatus: { [key: number]: boolean } = {}
            for (const module of modules) {
              unlockStatus[module.id] = await isModuleUnlocked(currentUser.id, "engineer", module.id)
            }
            setModuleUnlockStatus(unlockStatus)
          } catch (error) {
            console.error("Database error:", error)
            setDbError("Database tables may need to be set up. Please click the setup button below.")

            // Set default unlock status (only first module unlocked)
            const unlockStatus: { [key: number]: boolean } = {}
            modules.forEach((module) => {
              unlockStatus[module.id] = module.id === 1
            })
            setModuleUnlockStatus(unlockStatus)
          }
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSetupDatabase = async () => {
    try {
      const response = await fetch("/api/setup-tables", {
        method: "POST",
      })

      if (response.ok) {
        setDbError(null)
        // Reload the page to refresh data
        window.location.reload()
      } else {
        const error = await response.text()
        console.error("Setup failed:", error)
      }
    } catch (error) {
      console.error("Error setting up database:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto mt-12 text-center">
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">Login Required</CardTitle>
              <CardDescription>Please login to access the Engineering Physics modules.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-gray-600">You need to be logged in to track your progress and unlock modules.</p>
              <div className="flex gap-4 justify-center">
                <Link href="/login-page">
                  <Button className="bg-purple-600 hover:bg-purple-700">Login</Button>
                </Link>
                <Link href="/register-page">
                  <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                    Register
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (dbError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto mt-12 text-center">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Database Setup Required</CardTitle>
              <CardDescription className="text-red-600">{dbError}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button onClick={handleSetupDatabase} className="bg-red-600 hover:bg-red-700">
                Setup Database Tables
              </Button>
              <Link href="/career-paths">
                <Button variant="outline" className="w-full">
                  Back to Career Paths
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const completedModules = progress?.completed_modules || []
  const progressPercentage = (completedModules.length / modules.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-25 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <MotionDiv initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
          <div className="flex items-center mb-6">
            <Link href="/career-paths" className="mr-4">
              <Button variant="outline" size="icon" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Physics for Engineers
              </h1>
              <p className="text-purple-600 mt-2">Master physics concepts essential for engineering success</p>
            </div>
          </div>

          {/* Progress Overview */}
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-purple-800">Your Progress</CardTitle>
                  <CardDescription className="text-purple-600">
                    {completedModules.length} of {modules.length} modules completed
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-800">{Math.round(progressPercentage)}%</div>
                  <div className="text-sm text-purple-600">Complete</div>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-3 bg-purple-100 mt-4" />
            </CardHeader>
          </Card>
        </MotionDiv>

        {/* Modules Grid */}
        <MotionDiv initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
          {modules.map((module, index) => {
            const isCompleted = completedModules.includes(module.id)
            const isUnlocked = moduleUnlockStatus[module.id] || false
            const canAccess = isUnlocked || isCompleted

            return (
              <MotionDiv key={module.id} variants={popIn}>
                <Card
                  className={`transition-all duration-300 ${
                    canAccess ? "hover:shadow-lg border-purple-200 bg-white" : "border-gray-200 bg-gray-50 opacity-75"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              isCompleted
                                ? "bg-green-100 text-green-700"
                                : canAccess
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {isCompleted ? <CheckCircle className="h-4 w-4" /> : module.id}
                          </div>
                          <CardTitle
                            className={`${canAccess ? "text-purple-800" : "text-gray-500"} text-lg md:text-xl`}
                          >
                            {module.title}
                          </CardTitle>
                          {isCompleted && <Trophy className="h-5 w-5 text-yellow-500" />}
                        </div>
                        <CardDescription className={canAccess ? "text-gray-600" : "text-gray-400"}>
                          {module.description}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {isCompleted ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <Star className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        ) : canAccess ? (
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                            <BookOpen className="h-3 w-3 mr-1" />
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-500 border-gray-200">
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {module.topics.map((topic) => (
                        <Badge
                          key={topic}
                          variant="outline"
                          className={`text-xs ${canAccess ? "border-purple-200 text-purple-600" : "border-gray-200 text-gray-400"}`}
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className={`flex items-center gap-1 ${canAccess ? "text-gray-600" : "text-gray-400"}`}>
                          <Clock className="h-4 w-4" />
                          {module.duration}
                        </div>
                        <Badge
                          variant="outline"
                          className={`${
                            module.difficulty === "Beginner"
                              ? "border-green-200 text-green-700"
                              : module.difficulty === "Intermediate"
                                ? "border-yellow-200 text-yellow-700"
                                : "border-red-200 text-red-700"
                          }`}
                        >
                          {module.difficulty}
                        </Badge>
                      </div>
                      {canAccess ? (
                        <Link href={`/career-paths/engineer/module/${module.id}`}>
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            {isCompleted ? "Review" : "Start Module"}
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled className="bg-gray-300 text-gray-500 cursor-not-allowed">
                          <Lock className="h-4 w-4 mr-2" />
                          Complete Previous Module
                        </Button>
                      )}
                    </div>
                    {!canAccess && module.id > 1 && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-amber-800 text-sm font-medium">🔒 Module Locked</p>
                        <p className="text-amber-700 text-xs mt-1">
                          Complete Module {module.id - 1} with a perfect score to unlock this module.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </MotionDiv>
            )
          })}
        </MotionDiv>

        {/* Motivational Footer */}
        <MotionDiv initial="hidden" animate="visible" variants={fadeIn} className="mt-12">
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-bold text-purple-800 mb-2">Ready to Master Engineering Physics?</h3>
              <p className="text-purple-600 mb-4">
                Each module builds upon the previous one. Take your time, achieve perfect scores, and unlock your
                potential!
              </p>
              <div className="flex justify-center gap-4 text-sm text-purple-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Perfect Score Required
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Unlock Next Module
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionDiv>
      </div>
    </div>
  )
}
