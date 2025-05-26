"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { MotionDiv, fadeIn } from "@/components/motion"
import { getCurrentUser, signOut } from "@/lib/db-service"
import { getUserStatistics } from "@/lib/data-service"
import { ProgressChart } from "@/components/progress-chart"
import { Achievements } from "@/components/achievements"
import { AccountSettings } from "@/components/account-settings"
import { Award, BookOpen, CheckCircle, LogOut, User, Settings } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("progress")

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getCurrentUser()

        if (!user) {
          router.push("/login")
          return
        }

        setCurrentUser(user)

        const userStats = await getUserStatistics(user.id)
        setStats(userStats)
      } catch (error) {
        console.error("Error loading profile data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Login Required</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your profile.</p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Physics</span> Digital Learning System
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <MotionDiv initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="md:w-1/3">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto rounded-full bg-primary/10 p-6 mb-4">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle>{currentUser.full_name}</CardTitle>
                  <CardDescription>{currentUser.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Overall Completion</span>
                        <span className="text-sm text-muted-foreground">
                          {stats?.totalModulesCompleted || 0}/18 modules
                        </span>
                      </div>
                      <Progress
                        value={stats?.totalModulesCompleted ? (stats.totalModulesCompleted / 18) * 100 : 0}
                        className="h-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center justify-center rounded-md border p-4">
                        <CheckCircle className="h-6 w-6 mb-1 text-primary" />
                        <span className="text-sm font-medium">{stats?.totalQuizzesTaken || 0}</span>
                        <span className="text-xs text-muted-foreground">Quizzes Taken</span>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-md border p-4">
                        <Award className="h-6 w-6 mb-1 text-primary" />
                        <span className="text-sm font-medium">{stats?.totalAchievements || 0}</span>
                        <span className="text-xs text-muted-foreground">Achievements</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/career-paths">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Continue Learning
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="md:w-2/3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="progress">Progress</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="history">Quiz History</TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="progress" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Progress</CardTitle>
                      <CardDescription>Your progress across all career paths</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {stats?.progressByPath?.map((progress: any) => (
                          <div key={progress.career_path} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium capitalize">{progress.career_path} Path</span>
                              <span className="text-sm text-muted-foreground">
                                {progress.completed_modules?.length || 0}/6 modules
                              </span>
                            </div>
                            <Progress
                              value={
                                progress.completed_modules?.length ? (progress.completed_modules.length / 6) * 100 : 0
                              }
                              className="h-2"
                            />
                          </div>
                        ))}

                        <div className="h-60">
                          <ProgressChart userId={currentUser.id} careerPath="engineer" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="achievements" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Achievements</CardTitle>
                      <CardDescription>Badges and awards you've earned</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Achievements userId={currentUser.id} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quiz History</CardTitle>
                      <CardDescription>Your recent quiz attempts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {stats?.recentQuizzes?.length > 0 ? (
                        <div className="space-y-4">
                          {stats.recentQuizzes.map((quiz: any) => (
                            <div key={quiz.id} className="flex items-center justify-between border-b pb-4">
                              <div>
                                <p className="font-medium">
                                  Module {quiz.module_id} - <span className="capitalize">{quiz.career_path}</span> Path
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(quiz.completed_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center">
                                <div className="text-right mr-4">
                                  <p className="font-medium">
                                    {quiz.score}/{quiz.total_questions}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {Math.round((quiz.score / quiz.total_questions) * 100)}%
                                  </p>
                                </div>
                                {quiz.passed ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
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
                                    className="h-5 w-5 text-red-500"
                                  >
                                    <path d="M18 6 6 18"></path>
                                    <path d="m6 6 12 12"></path>
                                  </svg>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">No quiz history found.</p>
                          <Button className="mt-4" asChild>
                            <Link href="/career-paths">Take a Quiz</Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                  <AccountSettings user={currentUser} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </MotionDiv>
      </main>
    </div>
  )
}
