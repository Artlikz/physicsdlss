"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, BookOpen, Brain, Activity, CheckCircle, XCircle, Clock, Award } from "lucide-react"
import { getEngineerModule } from "@/lib/engineer-modules"

export default function EngineerModulePage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = Number.parseInt(params.id as string)

  const [activeTab, setActiveTab] = useState("content")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  const module = getEngineerModule(moduleId)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
          <p className="text-muted-foreground mb-6">The module you're looking for doesn't exist.</p>
          <Link href="/career-paths/engineer">
            <Button>Back to Engineer Path</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleOptionSelect = (optionIndex: number) => {
    if (!isAnswerChecked) {
      setSelectedOption(optionIndex)
    }
  }

  const checkAnswer = () => {
    if (selectedOption === null) return
    setIsAnswerChecked(true)
    if (selectedOption === module.quiz.questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    setSelectedOption(null)
    setIsAnswerChecked(false)

    if (currentQuestionIndex < module.quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setIsAnswerChecked(false)
    setScore(0)
    setQuizCompleted(false)
  }

  const finalScore =
    score + (isAnswerChecked && selectedOption === module.quiz.questions[currentQuestionIndex].correctAnswer ? 1 : 0)
  const isPassed = (finalScore / module.quiz.questions.length) * 100 >= module.quiz.passingScore

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/career-paths/engineer" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{module.difficulty}</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {module.duration}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {module.title}
          </h1>
          <p className="text-muted-foreground">{module.description}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Quiz
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Module Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Summary</h3>
                    <p className="text-muted-foreground">{module.content.summary}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Key Concepts</h3>
                    <div className="space-y-2">
                      {module.content.keyPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-sm">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Essential Formulas</h3>
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      {module.content.formulas.map((formula, index) => (
                        <div key={index} className="font-mono text-sm">
                          {formula}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Learning Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {module.content.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {module.content.applications.map((application, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        {application}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          {!quizCompleted ? (
            <Card>
              <CardHeader>
                <CardTitle>Quiz Challenge</CardTitle>
                <CardDescription>
                  Question {currentQuestionIndex + 1} of {module.quiz.questions.length}
                </CardDescription>
                <Progress value={((currentQuestionIndex + 1) / module.quiz.questions.length) * 100} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium">{module.quiz.questions[currentQuestionIndex].question}</h3>

                <div className="space-y-2">
                  {module.quiz.questions[currentQuestionIndex].options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedOption === index ? "border-primary bg-primary/10" : "hover:border-gray-400"
                      } ${
                        isAnswerChecked && index === module.quiz.questions[currentQuestionIndex].correctAnswer
                          ? "border-green-500 bg-green-50"
                          : isAnswerChecked && selectedOption === index
                            ? "border-red-500 bg-red-50"
                            : ""
                      }`}
                      onClick={() => handleOptionSelect(index)}
                    >
                      {option}
                    </div>
                  ))}
                </div>

                {isAnswerChecked && (
                  <div
                    className={`p-4 rounded-lg ${
                      selectedOption === module.quiz.questions[currentQuestionIndex].correctAnswer
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {selectedOption === module.quiz.questions[currentQuestionIndex].correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">
                          {selectedOption === module.quiz.questions[currentQuestionIndex].correctAnswer
                            ? "Correct!"
                            : "Incorrect"}
                        </p>
                        <p className="text-sm mt-1">{module.quiz.questions[currentQuestionIndex].explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {!isAnswerChecked ? (
                  <Button onClick={checkAnswer} disabled={selectedOption === null} className="w-full">
                    Check Answer
                  </Button>
                ) : (
                  <Button onClick={nextQuestion} className="w-full">
                    {currentQuestionIndex < module.quiz.questions.length - 1 ? "Next Question" : "Complete Quiz"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Quiz Results
                </CardTitle>
                <CardDescription>
                  You scored {finalScore} out of {module.quiz.questions.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div
                    className={`p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center ${
                      isPassed ? "bg-green-100" : "bg-orange-100"
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    ) : (
                      <XCircle className="h-12 w-12 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{isPassed ? "Congratulations!" : "Keep Learning!"}</h3>
                    <p className="text-muted-foreground">
                      {isPassed
                        ? "You've successfully completed this module!"
                        : `You need ${module.quiz.passingScore}% to pass. Try again!`}
                    </p>
                  </div>
                  <div className="text-2xl font-bold">
                    {Math.round((finalScore / module.quiz.questions.length) * 100)}%
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" onClick={restartQuiz} className="flex-1">
                  Retry Quiz
                </Button>
                <Button onClick={() => router.push("/career-paths/engineer")} className="flex-1">
                  Continue Learning
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {module.activities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                    <Badge variant="outline" className="capitalize">
                      {activity.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                  <Badge variant="secondary" className="capitalize">
                    {activity.type}
                  </Badge>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Start Activity
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
