"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MotionDiv, fadeIn } from "@/components/motion"
import { Beaker, BookOpen, Lightbulb, Puzzle } from "lucide-react"

interface Activity {
  title: string
  description: string
  type: string
}

interface ModuleActivitiesProps {
  activities: Activity[]
  moduleId: number
  careerPath: string
}

export function ModuleActivities({ activities, moduleId, careerPath }: ModuleActivitiesProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "interactive":
        return <Puzzle className="h-5 w-5" />
      case "practice":
        return <BookOpen className="h-5 w-5" />
      case "lab":
        return <Beaker className="h-5 w-5" />
      case "project":
        return <Lightbulb className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "interactive":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "practice":
        return "bg-green-100 text-green-800 border-green-200"
      case "lab":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "project":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <MotionDiv initial="hidden" animate="visible" variants={fadeIn}>
      <Card>
        <CardHeader>
          <CardTitle>STEM Activities</CardTitle>
          <CardDescription>Apply what you've learned with these hands-on activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {activities.map((activity, index) => (
              <MotionDiv
                key={index}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{activity.title}</CardTitle>
                      <Badge className={`${getActivityColor(activity.type)} ml-2`}>
                        <span className="flex items-center">
                          {getActivityIcon(activity.type)}
                          <span className="ml-1 capitalize">{activity.type}</span>
                        </span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-muted-foreground mb-4">{activity.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Start Activity
                    </Button>
                  </CardContent>
                </Card>
              </MotionDiv>
            ))}
          </div>
        </CardContent>
      </Card>
    </MotionDiv>
  )
}
