"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getQuizResults, getUserProgress } from "@/lib/db-service"
import { MotionDiv, fadeIn } from "@/components/motion"
import { Skeleton } from "@/components/ui/skeleton"

interface ProgressData {
  name: string
  completed: number
  perfect: number
}

export function ProgressChart({ userId, careerPath }: { userId: string; careerPath: string }) {
  const [data, setData] = useState<ProgressData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // Get user progress
        const progress = await getUserProgress(userId, careerPath)

        // Get quiz results
        const quizResults = await getQuizResults(userId, careerPath)

        // Format data for the chart
        const chartData: ProgressData[] = [
          { name: "Modules", completed: progress?.completed_modules?.length || 0, perfect: 0 },
          { name: "Quizzes", completed: quizResults.length, perfect: quizResults.filter((q) => q.passed).length },
        ]

        setData(chartData)
      } catch (error) {
        console.error("Error loading chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [userId, careerPath])

  if (loading) {
    return <Skeleton className="h-40 w-full" />
  }

  return (
    <MotionDiv initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Progress Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value, name) => [`${value} ${name === "completed" ? "completed" : "perfect scores"}`, ""]}
              />
              <Bar dataKey="completed" name="Completed" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                ))}
              </Bar>
              <Bar dataKey="perfect" name="Perfect Score" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="hsl(var(--secondary))" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </MotionDiv>
  )
}
