"use client"

import { useEffect, useState } from "react"
import { Award, Rocket, Clock, Milestone, Target, Bookmark, type LucideIcon } from "lucide-react"
import { getUserAchievements } from "@/lib/db-service"
import { MotionDiv, staggerContainer, fadeIn } from "@/components/motion"
import { Skeleton } from "@/components/ui/skeleton"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earned_at?: string
}

const icons: Record<string, LucideIcon> = {
  rocket: Rocket,
  award: Award,
  clock: Clock,
  milestone: Milestone,
  target: Target,
  default: Bookmark,
}

export function Achievements({ userId }: { userId: string }) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAchievements() {
      try {
        const userAchievements = await getUserAchievements(userId)

        const formattedAchievements = userAchievements.map((a: any) => ({
          id: a.achievements.id,
          name: a.achievements.name,
          description: a.achievements.description,
          icon: a.achievements.icon,
          earned_at: a.earned_at,
        }))

        setAchievements(formattedAchievements)
      } catch (error) {
        console.error("Error loading achievements:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAchievements()
  }, [userId])

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Achievements</h3>

      <MotionDiv initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-3 gap-2">
        {achievements.length > 0 ? (
          achievements.map((achievement) => {
            const Icon = icons[achievement.icon] || icons.default

            return (
              <MotionDiv
                key={achievement.id}
                variants={fadeIn}
                className="flex flex-col items-center justify-center rounded-md bg-primary/10 p-2 hover:bg-primary/20 transition-colors cursor-pointer group relative"
              >
                <Icon className="h-6 w-6 mb-1 text-primary" />
                <span className="text-xs text-center">{achievement.name}</span>

                <div className="absolute inset-0 bg-background/95 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                  <p className="text-xs text-center">{achievement.description}</p>
                </div>
              </MotionDiv>
            )
          })
        ) : (
          <div className="col-span-3 text-center py-4 text-sm text-muted-foreground">
            Complete modules to earn achievements!
          </div>
        )}
      </MotionDiv>
    </div>
  )
}
