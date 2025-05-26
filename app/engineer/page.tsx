"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MotionDiv, fadeIn } from "@/components/motion"
import { Lock, CheckCircle2, Search, BookOpen, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getCurrentUser, getUserProgress, isModuleUnlocked } from "@/lib/db-service"
import { LoginModal } from "@/components/login-modal"

// Define the modules for the engineer path
const engineerModules = [
  {
    id: 1,
    title: "Introduction to Physics for Engineers",
    description: "Fundamental concepts, measurements, and the scientific method",
    topics: ["Units and Measurements", "Vectors", "Scientific Method", "Problem-Solving Approach"],
    duration: "45 min",
  },
  {
    id: 2,
    title: "Mechanics: Forces and Motion",
    description: "Newton's laws, forces, and their applications in engineering",
    topics: ["Newton's Laws", "Force Analysis", "Free Body Diagrams", "Friction", "Equilibrium"],
    duration: "60 min",
  },
  {
    id: 3,
    title: "Energy and Work",
    description: "Energy principles, conservation laws, and power calculations",
    topics: ["Work-Energy Theorem", "Potential Energy", "Kinetic Energy", "Conservation of Energy", "Power"],
    duration: "50 min",
  },
  {
    id: 4,
    title: "Rotational Dynamics",
    description: "Torque, moment of inertia, and angular momentum in engineering systems",
    topics: ["Torque", "Moment of Inertia", "Angular Momentum", "Rotational Equilibrium", "Gyroscopes"],
    duration: "55 min",
  },
  {
    id: 5,
    title: "Fluid Mechanics",
    description: "Fluid statics and dynamics for engineering applications",
    topics: ["Pressure", "Buoyancy", "Fluid Flow", "Bernoulli's Equation", "Viscosity"],
    duration: "65 min",
  },
  {
    id: 6,
    title: "Thermodynamics",
    description: "Heat, temperature, and energy transfer in engineering systems",
    topics: ["Laws of Thermodynamics", "Heat Transfer", "Entropy", "Thermal Expansion", "Heat Engines"],
    duration: "70 min",
  },
]

export default function EngineerPathPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [moduleStatus, setModuleStatus] = useState<{ [key: number]: { isCompleted: boolean; isUnlocked: boolean } }>({})
  const [loading, setLoading] = useState(true)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedModule, setSelectedModule] = useState(engineerModules[0])
  const [activeTab, setActiveTab] = useState("concept")

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
          setLoading(false)
          return
        }

        setUser(currentUser)

        // Get user progress
        const userProgress = await getUserProgress(currentUser.id, "engineer")
        setProgress(userProgress)

        // Check module status
        const statusMap: { [key: number]: { isCompleted: boolean; isUnlocked: boolean } } = {}

        for (const module of engineerModules) {
          const isCompleted = userProgress?.completed_modules?.includes(module.id) || false
          const isUnlocked = await isModuleUnlocked(currentUser.id, "engineer", module.id)

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

  const filteredModules = engineerModules.filter(
    (module) =>
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleStartLesson = () => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }

    router.push(`/career-paths/engineer/module/${selectedModule.id}`)
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

  // Calculate overall completion percentage
  const completedModules = progress?.completed_modules || []
  const overallCompletion = Math.round((completedModules.length / engineerModules.length) * 100) || 0

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-primary">Physics</span> Digital Learning System
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            About Us
          </Link>
          <Link href="/career-paths" className="text-sm font-medium hover:underline underline-offset-4">
            Career Paths
          </Link>
          <Link href="/resources" className="text-sm font-medium hover:underline underline-offset-4">
            Physics Learning Resources
          </Link>
          <Link href="/publications" className="text-sm font-medium hover:underline underline-offset-4">
            STEM Publications
          </Link>
          <Link href="/contact-us" className="text-sm font-medium hover:underline underline-offset-4">
            Contact Us
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <Button variant="ghost" size="icon" onClick={() => router.push("/profile")}>
              <span className="sr-only">Profile</span>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                {user.full_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </div>
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsLoginModalOpen(true)}>
              Log in
            </Button>
          )}
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-gray-50 hidden md:block">
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search modules..."
                className="w-full bg-background pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <MotionDiv initial="hidden" animate="visible" variants={fadeIn} className="space-y-1">
                <h3 className="font-medium text-sm">Learning Modules</h3>
                <div className="space-y-2">
                  {filteredModules.map((module) => {
                    const status = moduleStatus[module.id] || { isCompleted: false, isUnlocked: module.id === 1 }
                    const isCurrent = progress?.current_module === module.id

                    return (
                      <button
                        key={module.id}
                        onClick={() => setSelectedModule(module)}
                        className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                          selectedModule.id === module.id
                            ? "bg-primary text-primary-foreground"
                            : status.isUnlocked
                              ? "hover:bg-muted"
                              : "opacity-50 cursor-not-allowed"
                        }`}
                        disabled={!status.isUnlocked}
                      >
                        <span className="truncate">{module.title}</span>
                        {status.isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 ml-2" />
                        ) : !status.isUnlocked ? (
                          <Lock className="h-4 w-4 ml-2" />
                        ) : null}
                      </button>
                    )
                  })}
                </div>
              </MotionDiv>
            )}
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center mb-6">
            <Link href="/career-paths" className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="space-y-4">
              <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden">
                <img
                  src="https://cdn.pixabay.com/photo/2023/06/10/05/36/civil-engineering-8053197_1280.png"
                  alt="Engineering blueprint with technical tools"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Physics for Engineers</h1>
                <p className="text-muted-foreground">Master the physics principles essential for engineering careers</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              {loading ? (
                <div className="h-[400px] w-full bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <MotionDiv initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedModule.title}</CardTitle>
                      <CardDescription>
                        {moduleStatus[selectedModule.id]?.isUnlocked
                          ? `Progress: ${moduleStatus[selectedModule.id]?.isCompleted ? "100" : "0"}% complete`
                          : "Complete previous modules to unlock"}
                      </CardDescription>
                      {moduleStatus[selectedModule.id]?.isCompleted && (
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-full"></div>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-medium">Module Overview</h3>
                          <p className="text-muted-foreground">
                            This module covers the fundamental concepts of {selectedModule.title.toLowerCase()},
                            providing a solid foundation for engineering applications.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium">Key Topics</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedModule.topics.map((topic, i) => (
                              <Badge key={i} variant="outline" className="bg-secondary/50">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium">Key Formulas</h3>
                          <div className="bg-muted p-4 rounded-md">
                            {selectedModule.id === 1 && (
                              <div className="space-y-2">
                                <p>
                                  Vector Addition: <code>C = A + B</code>
                                </p>
                                <p>
                                  Vector Magnitude:{" "}
                                  <code>
                                    |A| = √(A<sub>x</sub>² + A<sub>y</sub>² + A<sub>z</sub>²)
                                  </code>
                                </p>
                                <p>
                                  Unit Conversion:{" "}
                                  <code>
                                    value<sub>new</sub> = value<sub>old</sub> × conversion factor
                                  </code>
                                </p>
                              </div>
                            )}
                            {selectedModule.id === 2 && (
                              <div className="space-y-2">
                                <p>
                                  Newton's Second Law: <code>F = ma</code>
                                </p>
                                <p>
                                  Law of Gravitation: <code>F = G(m₁m₂)/r²</code>
                                </p>
                                <p>
                                  Friction Force:{" "}
                                  <code>
                                    F<sub>f</sub> = μN
                                  </code>
                                </p>
                              </div>
                            )}
                            {selectedModule.id === 3 && (
                              <div className="space-y-2">
                                <p>
                                  Kinetic Energy: <code>KE = ½mv²</code>
                                </p>
                                <p>
                                  Potential Energy: <code>PE = mgh</code>
                                </p>
                                <p>
                                  Work: <code>W = F·d·cos(θ)</code>
                                </p>
                                <p>
                                  Power: <code>P = W/t</code>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={handleStartLesson}
                        disabled={!moduleStatus[selectedModule.id]?.isUnlocked}
                        className="w-full"
                      >
                        {moduleStatus[selectedModule.id]?.isCompleted ? "Review Module" : "Start Learning"}
                      </Button>
                    </CardFooter>
                  </Card>
                </MotionDiv>
              )}
            </div>

            <div className="space-y-6">
              {loading ? (
                <>
                  <div className="h-[200px] w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-[200px] w-full bg-gray-200 rounded animate-pulse"></div>
                </>
              ) : user ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Progress</CardTitle>
                      <CardDescription>Engineering Physics Path</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Overall Completion</span>
                            <span className="text-sm text-muted-foreground">
                              {completedModules.length}/{engineerModules.length} modules
                            </span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${overallCompletion}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link href="/resources" className="text-primary hover:underline flex items-center">
                            <BookOpen className="h-4 w-4 mr-2" />
                            <span>Engineering Physics Handbook</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/resources" className="text-primary hover:underline flex items-center">
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
                              className="h-4 w-4 mr-2"
                            >
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <span>Interactive Simulations</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/resources" className="text-primary hover:underline flex items-center">
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
                              className="h-4 w-4 mr-2"
                            >
                              <path d="m7 11 2-2-2-2"></path>
                              <path d="M11 13h4"></path>
                              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                            </svg>
                            <span>Engineering Problem Set</span>
                          </Link>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="p-6 text-center">
                  <p className="mb-4 text-muted-foreground">
                    Log in to track your progress and view personalized recommendations.
                  </p>
                  <Button onClick={() => setIsLoginModalOpen(true)}>Log in or Register</Button>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} redirectPath="/engineer" />
    </div>
  )
}
