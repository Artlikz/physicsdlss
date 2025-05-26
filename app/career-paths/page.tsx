"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MotionDiv, fadeIn, popIn, staggerContainer } from "@/components/motion"
import { getCurrentUser } from "@/lib/db-service"

export default function CareerPathsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        setLoading(false)
      } catch (error) {
        console.error("Error loading user:", error)
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  if (loading) {
    return (
      <div className="container py-8 px-4 mx-auto max-w-6xl">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container py-8 px-4 mx-auto max-w-6xl">
        <div className="max-w-md mx-auto mt-12 text-center">
          <Card>
            <CardHeader>
              <CardTitle>Login Required</CardTitle>
              <CardDescription>
                Please login or register to access career paths and track your progress.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-muted-foreground">You need to be logged in to view and select career paths.</p>
              <div className="flex gap-4 justify-center">
                <Link href="/login-page">
                  <Button>Login</Button>
                </Link>
                <Link href="/register-page">
                  <Button variant="outline">Register</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4 mx-auto max-w-6xl">
      <MotionDiv initial="hidden" animate="visible" variants={fadeIn} className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-heading">Choose Your Career Path</h1>
        <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">
          Select the career path that aligns with your goals. Each path offers specialized physics modules tailored to
          the specific needs and applications of that profession.
        </p>
      </MotionDiv>

      <MotionDiv
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12"
      >
        <MotionDiv variants={popIn}>
          <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Physics for Engineers</CardTitle>
              <CardDescription>
                Focus on mechanics, thermodynamics, and electromagnetism with engineering applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="aspect-video rounded-md overflow-hidden mb-4 relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/drawing-8792184_1280.jpg-egcqawS1g99Vq56vauzlVkOh6M33FI.jpeg"
                  alt="Engineering Physics"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">You'll Learn:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                  <li>Applied mechanics and material properties</li>
                  <li>Thermodynamics and heat transfer</li>
                  <li>Electrical circuits and electromagnetic fields</li>
                  <li>Fluid dynamics and mechanical systems</li>
                  <li>Structural analysis and vibrations</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/career-paths/engineer" className="w-full">
                <Button className="w-full">Start Learning</Button>
              </Link>
            </CardFooter>
          </Card>
        </MotionDiv>

        <MotionDiv variants={popIn}>
          <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Physics for Doctors</CardTitle>
              <CardDescription>
                Explore biophysics, radiation, fluid dynamics, and optics for medical applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="aspect-video rounded-md overflow-hidden mb-4 relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-pixabay-40568.jpg-PrCVGrAYSap9tov3QUGTvetSb1eppI.jpeg"
                  alt="Medical Physics"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">You'll Learn:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                  <li>Biomechanics and body movement</li>
                  <li>Medical imaging and radiation physics</li>
                  <li>Fluid dynamics in circulatory systems</li>
                  <li>Optics and vision science</li>
                  <li>Bioelectricity and neural signals</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/career-paths/doctor" className="w-full">
                <Button className="w-full">Start Learning</Button>
              </Link>
            </CardFooter>
          </Card>
        </MotionDiv>

        <MotionDiv variants={popIn}>
          <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Physics for Pilots</CardTitle>
              <CardDescription>Study aerodynamics, meteorology, navigation, and aircraft systems.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="aspect-video rounded-md overflow-hidden mb-4 relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/john-mcarthur-PrdNTrIrG8w-unsplash.jpg-ocDKmghvC3daprMgNUCJfexPLc8jMj.jpeg"
                  alt="Aviation Physics"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">You'll Learn:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                  <li>Principles of flight and aerodynamics</li>
                  <li>Atmospheric physics and weather patterns</li>
                  <li>Navigation systems and principles</li>
                  <li>Aircraft performance and limitations</li>
                  <li>Aviation instruments and electronics</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/career-paths/pilot" className="w-full">
                <Button className="w-full">Start Learning</Button>
              </Link>
            </CardFooter>
          </Card>
        </MotionDiv>
      </MotionDiv>
    </div>
  )
}
