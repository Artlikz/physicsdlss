"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MotionDiv, fadeIn } from "@/components/motion"
import { getCurrentUser } from "@/lib/db-service"
import { getSystemStatistics } from "@/lib/data-service"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Users, BookOpen, Award, CheckCircle } from "lucide-react"

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getCurrentUser()
        setCurrentUser(user)

        if (user) {
          const systemStats = await getSystemStatistics()
          setStats(systemStats)
        }
      } catch (error) {
        console.error("Error loading admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const chartData = [
    { name: "Users", value: stats?.totalUsers || 0 },
    { name: "Quizzes", value: stats?.totalQuizzes || 0 },
    { name: "Achievements", value: stats?.totalAchievements || 0 },
  ]

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
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to access the admin dashboard.</p>
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
            <span className="text-sm">{currentUser.full_name}</span>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Profile</span>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                {currentUser.full_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </div>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <MotionDiv initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Link href="/">
              <Button variant="outline">Back to Site</Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">{stats?.totalQuizzes || 0}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Achievements Awarded</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">{stats?.totalAchievements || 0}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Popular Career Path</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold capitalize">{stats?.mostPopularCareerPath || "N/A"}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>System Statistics</CardTitle>
                <CardDescription>Overview of system usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="hsl(var(--primary))" name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage system data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/admin/users">
                  <Button className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/resources">
                  <Button className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Manage Learning Resources
                  </Button>
                </Link>
                <Link href="/admin/achievements">
                  <Button className="w-full justify-start">
                    <Award className="mr-2 h-4 w-4" />
                    Manage Achievements
                  </Button>
                </Link>
                <Link href="/admin/statistics">
                  <Button className="w-full justify-start">
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
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M3 3v18h18" />
                      <path d="M18 17V9" />
                      <path d="M13 17V5" />
                      <path d="M8 17v-3" />
                    </svg>
                    View Detailed Statistics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="users">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="quizzes">Quiz Results</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Create and manage student accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-4">Create accounts for students and manage existing users.</p>
                </CardContent>
                <CardFooter className="flex gap-4">
                  <Link href="/admin/users" className="w-full">
                    <Button className="w-full">Manage Users</Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Resources</CardTitle>
                  <CardDescription>Manage educational content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-4">
                    Add, edit, or remove learning resources for different modules and career paths.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/resources" className="w-full">
                    <Button className="w-full">Manage Resources</Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Manage user achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-4">Create, edit, or remove achievements that users can earn.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/achievements" className="w-full">
                    <Button className="w-full">Manage Achievements</Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="quizzes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Results</CardTitle>
                  <CardDescription>View user performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-4">Analyze quiz results and user performance across modules.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/quizzes" className="w-full">
                    <Button className="w-full">View Quiz Results</Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </MotionDiv>
      </main>
    </div>
  )
}
