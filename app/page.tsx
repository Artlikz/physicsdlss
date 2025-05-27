"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MotionDiv, fadeIn, popIn, staggerContainer } from "@/components/motion"
import {
  BookOpen,
  Trophy,
  Star,
  ArrowRight,
  CheckCircle,
  Target,
  Zap,
  Brain,
  Rocket,
  GraduationCap,
  Award,
} from "lucide-react"
import { getCurrentUser } from "@/lib/db-service"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const features = [
    {
      icon: <Target className="h-8 w-8 text-purple-600" />,
      title: "Career-Focused Learning",
      description: "Physics modules tailored specifically for Engineers, Doctors, and Pilots",
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Interactive Quizzes",
      description: "Test your knowledge with challenging quizzes that require perfect scores to advance",
    },
    {
      icon: <Trophy className="h-8 w-8 text-purple-600" />,
      title: "Progressive Unlocking",
      description: "Master each module completely before moving to the next level",
    },
    {
      icon: <Rocket className="h-8 w-8 text-purple-600" />,
      title: "Real-World Applications",
      description: "Learn physics concepts through practical, career-relevant examples",
    },
  ]

  const stats = [
    { number: "3", label: "Career Paths", icon: <GraduationCap className="h-5 w-5" /> },
    { number: "18", label: "Total Modules", icon: <BookOpen className="h-5 w-5" /> },
    { number: "100%", label: "Score Required", icon: <Star className="h-5 w-5" /> },
    { number: "∞", label: "Learning Potential", icon: <Award className="h-5 w-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-25 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <MotionDiv initial="hidden" animate="visible" variants={fadeIn} className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-4 py-2 text-sm font-medium">
                🚀 Master Physics for Your Career
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Physics Learning Made
              <br />
              <span className="relative">
                Career-Focused
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Master physics concepts tailored specifically for your career path. Whether you're pursuing engineering,
              medicine, or aviation, we've got the perfect learning journey for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link href="/career-paths">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                    Continue Learning
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register-page">
                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                      Start Your Journey
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/login-page">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-purple-300 text-purple-700 hover:bg-purple-50 text-lg px-8 py-3"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </MotionDiv>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <div className="w-20 h-20 bg-purple-300 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute top-40 right-20 opacity-20">
          <div className="w-16 h-16 bg-pink-300 rounded-full animate-bounce"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-20">
          <div className="w-12 h-12 bg-indigo-300 rounded-full animate-pulse"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <MotionDiv initial="hidden" animate="visible" variants={staggerContainer}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <MotionDiv key={index} variants={popIn}>
                  <Card className="text-center border-purple-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-2 text-purple-600">{stat.icon}</div>
                      <div className="text-3xl font-bold text-purple-800 mb-1">{stat.number}</div>
                      <div className="text-sm text-purple-600 font-medium">{stat.label}</div>
                    </CardContent>
                  </Card>
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <MotionDiv initial="hidden" animate="visible" variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
              Why Choose Our Physics Learning Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've designed a unique learning experience that combines rigorous physics education with practical,
              career-focused applications.
            </p>
          </MotionDiv>

          <MotionDiv initial="hidden" animate="visible" variants={staggerContainer}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <MotionDiv key={index} variants={popIn}>
                  <Card className="h-full border-purple-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">{feature.icon}</div>
                      <CardTitle className="text-purple-800">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-gray-600">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* Career Paths Preview */}
      <section className="py-20 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="container mx-auto px-4">
          <MotionDiv initial="hidden" animate="visible" variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">Choose Your Career Path</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each path is carefully crafted with physics concepts most relevant to your chosen profession.
            </p>
          </MotionDiv>

          <MotionDiv initial="hidden" animate="visible" variants={staggerContainer}>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Physics for Engineers",
                  description: "Mechanics, thermodynamics, and electromagnetism for engineering applications",
                  modules: 6,
                  color: "from-orange-400 to-red-500",
                  path: "engineer",
                },
                {
                  title: "Physics for Doctors",
                  description: "Biophysics, medical imaging, and radiation physics for healthcare professionals",
                  modules: 6,
                  color: "from-blue-400 to-purple-500",
                  path: "doctor",
                },
                {
                  title: "Physics for Pilots",
                  description: "Aerodynamics, navigation, and atmospheric physics for aviation professionals",
                  modules: 6,
                  color: "from-green-400 to-blue-500",
                  path: "pilot",
                },
              ].map((career, index) => (
                <MotionDiv key={index} variants={popIn}>
                  <Card className="h-full border-purple-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <CardHeader>
                      <div
                        className={`h-32 bg-gradient-to-br ${career.color} rounded-lg mb-4 flex items-center justify-center`}
                      >
                        <GraduationCap className="h-16 w-16 text-white" />
                      </div>
                      <CardTitle className="text-purple-800">{career.title}</CardTitle>
                      <CardDescription>{career.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                          {career.modules} Modules
                        </Badge>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                          Progressive Learning
                        </div>
                      </div>
                      <Link href={user ? "/career-paths" : "/register-page"}>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          {user ? "Explore Path" : "Get Started"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <MotionDiv initial="hidden" animate="visible" variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">How Our Learning System Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our unique progressive learning system ensures you truly master each concept before moving forward.
            </p>
          </MotionDiv>

          <MotionDiv initial="hidden" animate="visible" variants={staggerContainer}>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Study the Module",
                  description:
                    "Learn physics concepts through interactive content, examples, and real-world applications",
                  icon: <BookOpen className="h-8 w-8" />,
                },
                {
                  step: "2",
                  title: "Take the Quiz",
                  description: "Test your understanding with challenging questions that require deep comprehension",
                  icon: <Brain className="h-8 w-8" />,
                },
                {
                  step: "3",
                  title: "Achieve Perfect Score",
                  description: "Score 100% to prove mastery and unlock the next module in your learning journey",
                  icon: <Trophy className="h-8 w-8" />,
                },
              ].map((step, index) => (
                <MotionDiv key={index} variants={popIn}>
                  <Card className="text-center border-purple-200 bg-white hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        {step.icon}
                      </div>
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                        {step.step}
                      </div>
                      <CardTitle className="text-purple-800">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600">{step.description}</CardDescription>
                    </CardContent>
                  </Card>
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-4 text-center">
          <MotionDiv initial="hidden" animate="visible" variants={fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Master Physics?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are advancing their careers through our comprehensive physics education
              platform.
            </p>
            {user ? (
              <Link href="/career-paths">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3">
                  Continue Your Journey
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/register-page">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3">
                  Start Learning Today
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </MotionDiv>
        </div>
      </section>
    </div>
  )
}
