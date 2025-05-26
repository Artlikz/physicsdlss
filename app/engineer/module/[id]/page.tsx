"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser, isModuleUnlocked, saveQuizResult, updateUserProgress } from "@/lib/db-service"
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"

// Define the modules for the engineer path
const engineerModules = [
  {
    id: 1,
    title: "Introduction to Physics for Engineers",
    description: "Fundamental concepts, measurements, and the scientific method",
    content: `
      <h2>Introduction to Physics for Engineers</h2>
      <p>Physics is the foundation of engineering. This module introduces the fundamental concepts, units of measurement, and the scientific method that engineers use to understand and manipulate the physical world.</p>
      
      <h3>Key Concepts</h3>
      <ul>
        <li>SI Units and Measurement Standards</li>
        <li>Vector Analysis and Applications</li>
        <li>Scientific Method in Engineering</li>
        <li>Problem-Solving Approaches</li>
      </ul>
      
      <h3>Important Formulas</h3>
      <div class="bg-secondary/30 p-4 rounded-md my-4">
        <p>Vector Addition: <strong>C = A + B</strong></p>
        <p>Vector Magnitude: <strong>|A| = √(Ax² + Ay² + Az²)</strong></p>
        <p>Unit Conversion: <strong>value_new = value_old × conversion_factor</strong></p>
      </div>
    `,
    quiz: [
      {
        question: "Which of the following is NOT a base unit in the International System of Units (SI)?",
        options: ["Meter (m)", "Second (s)", "Newton (N)", "Kelvin (K)"],
        correctAnswer: 2,
        explanation:
          "The Newton (N) is a derived unit for force, not a base SI unit. The seven base SI units are: meter (m), kilogram (kg), second (s), ampere (A), kelvin (K), mole (mol), and candela (cd).",
      },
      {
        question: "A vector quantity has:",
        options: [
          "Only magnitude",
          "Only direction",
          "Both magnitude and direction",
          "Neither magnitude nor direction",
        ],
        correctAnswer: 2,
        explanation:
          "Vector quantities have both magnitude (size) and direction. Examples include force, velocity, acceleration, and displacement.",
      },
      {
        question:
          "Which step of the scientific method involves making educated guesses about the outcome of an experiment?",
        options: ["Observation", "Hypothesis formation", "Data analysis", "Conclusion"],
        correctAnswer: 1,
        explanation:
          "Hypothesis formation is the step where scientists make educated guesses or predictions about the outcome of an experiment based on prior knowledge and observations.",
      },
      {
        question:
          "Two vectors A and B have magnitudes of 3 units and 4 units respectively. If they are perpendicular to each other, what is the magnitude of their resultant vector?",
        options: ["1 unit", "5 units", "7 units", "12 units"],
        correctAnswer: 1,
        explanation:
          "When two vectors are perpendicular, the Pythagorean theorem can be used to find the magnitude of the resultant vector. If |A| = 3 and |B| = 4, then |A + B| = √(|A|² + |B|²) = √(3² + 4²) = √(9 + 16) = √25 = 5 units.",
      },
      {
        question: "Which of the following is an example of a scalar quantity?",
        options: ["Velocity", "Force", "Temperature", "Acceleration"],
        correctAnswer: 2,
        explanation:
          "Temperature is a scalar quantity because it only has magnitude, not direction. Velocity, force, and acceleration are all vector quantities that have both magnitude and direction.",
      },
    ],
  },
  {
    id: 2,
    title: "Mechanics: Forces and Motion",
    description: "Newton's laws, forces, and their applications in engineering",
    content: `
      <h2>Mechanics: Forces and Motion</h2>
      <p>This module covers the fundamental principles of mechanics, focusing on Newton's laws of motion and their applications in engineering contexts.</p>
      
      <h3>Key Concepts</h3>
      <ul>
        <li>Newton's Three Laws of Motion</li>
        <li>Force Analysis and Free Body Diagrams</li>
        <li>Friction and Its Engineering Applications</li>
        <li>Equilibrium Conditions</li>
        <li>Work, Energy, and Power</li>
      </ul>
      
      <h3>Important Formulas</h3>
      <div class="bg-secondary/30 p-4 rounded-md my-4">
        <p>Newton's Second Law: <strong>F = ma</strong></p>
        <p>Weight: <strong>W = mg</strong></p>
        <p>Friction Force: <strong>F_f = μN</strong></p>
        <p>Work: <strong>W = F·d·cos(θ)</strong></p>
      </div>
    `,
    quiz: [
      {
        question:
          "According to Newton's First Law, an object will remain at rest or in uniform motion unless acted upon by:",
        options: ["Gravity", "An external force", "Friction", "Air resistance"],
        correctAnswer: 1,
        explanation:
          "Newton's First Law (Law of Inertia) states that an object will remain at rest or in uniform motion in a straight line unless acted upon by an external force.",
      },
      {
        question: "A 5 kg object is subjected to a force of 20 N. What is its acceleration?",
        options: ["0.25 m/s²", "4 m/s²", "100 m/s²", "0.5 m/s²"],
        correctAnswer: 1,
        explanation:
          "Using Newton's Second Law (F = ma), we can calculate the acceleration: a = F/m = 20 N / 5 kg = 4 m/s².",
      },
      {
        question:
          "The coefficient of static friction between a wooden block and a table is 0.5. If the block has a mass of 2 kg, what is the minimum force needed to start moving the block?",
        options: ["1 N", "9.8 N", "19.6 N", "4.9 N"],
        correctAnswer: 1,
        explanation:
          "The normal force is N = mg = 2 kg × 9.8 m/s² = 19.6 N. The static friction force is F_s = μ_s × N = 0.5 × 19.6 N = 9.8 N.",
      },
      {
        question: "For an object to be in static equilibrium, which of the following conditions must be met?",
        options: [
          "The sum of all forces must be zero",
          "The sum of all torques must be zero",
          "Both A and B",
          "Neither A nor B",
        ],
        correctAnswer: 2,
        explanation:
          "For an object to be in static equilibrium, both the sum of all forces and the sum of all torques acting on the object must be zero.",
      },
      {
        question: "How much work is done when a force of 10 N moves an object 5 meters in the direction of the force?",
        options: ["2 J", "50 J", "15 J", "25 J"],
        correctAnswer: 1,
        explanation:
          "Work is calculated using the formula W = F·d·cos(θ). When the force is in the same direction as the displacement, cos(θ) = cos(0°) = 1. Therefore, W = 10 N × 5 m × 1 = 50 J.",
      },
    ],
  },
  // Additional modules would be defined here
]

export default function EngineerModulePage() {
  const router = useRouter()
  const params = useParams()
  const moduleId = Number.parseInt(params.id as string)

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("content")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  // Find the module
  const module = engineerModules.find((m) => m.id === moduleId)

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
          router.push(`/login-page?redirect=/engineer/module/${moduleId}`)
          return
        }

        setUser(currentUser)

        // Check if module is unlocked
        const moduleUnlocked = await isModuleUnlocked(currentUser.id, "engineer", moduleId)

        if (!moduleUnlocked) {
          router.push("/engineer")
          return
        }

        setLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [moduleId, router])

  if (loading) {
    return (
      <div className="container py-8 px-4 mx-auto max-w-6xl">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="container py-8 px-4 mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
          <p className="text-muted-foreground mb-6">The module you're looking for doesn't exist.</p>
          <Link href="/engineer">
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

    // Update score if correct
    if (selectedOption === module.quiz[currentQuestionIndex].correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    setSelectedOption(null)
    setIsAnswerChecked(false)

    if (currentQuestionIndex < module.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Quiz completed
      setQuizCompleted(true)

      // Save quiz result if user is logged in
      if (user) {
        const passed =
          score + (selectedOption === module.quiz[currentQuestionIndex].correctAnswer ? 1 : 0) === module.quiz.length

        saveQuizResult({
          user_id: user.id,
          module_id: moduleId,
          career_path: "engineer",
          score: score + (selectedOption === module.quiz[currentQuestionIndex].correctAnswer ? 1 : 0),
          total_questions: module.quiz.length,
          passed: passed,
        })

        // If passed, update user progress
        if (passed) {
          updateUserProgress(user.id, "engineer", moduleId)
        }
      }
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
    score + (isAnswerChecked && selectedOption === module.quiz[currentQuestionIndex].correctAnswer ? 1 : 0)
  const isPerfectScore = finalScore === module.quiz.length

  return (
    <div className="container py-8 px-4 mx-auto max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
        <Link href="/engineer" className="mr-0 md:mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{module.title}</h1>
          <p className="text-sm md:text-base text-muted-foreground">{module.description}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Module Content</TabsTrigger>
          <TabsTrigger value="quiz">Quiz Challenge</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <Card>
            <CardContent className="pt-6 px-3 md:px-6">
              <div
                className="prose max-w-none text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: module.content }}
              ></div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab("quiz")} className="w-full md:w-auto md:ml-auto">
                Take Quiz <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          {!quizCompleted ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Quiz Challenge</CardTitle>
                <CardDescription>
                  Question {currentQuestionIndex + 1} of {module.quiz.length}
                </CardDescription>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${((currentQuestionIndex + 1) / module.quiz.length) * 100}%` }}
                  ></div>
                </div>
              </CardHeader>
              <CardContent className="px-3 md:px-6">
                <div className="space-y-4">
                  <h2 className="text-base md:text-xl font-medium">{module.quiz[currentQuestionIndex].question}</h2>

                  <div className="space-y-2">
                    {module.quiz[currentQuestionIndex].options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-3 md:p-4 border rounded-md cursor-pointer transition-colors ${
                          selectedOption === index ? "border-primary bg-primary/10" : "hover:border-gray-400"
                        } ${
                          isAnswerChecked && index === module.quiz[currentQuestionIndex].correctAnswer
                            ? "border-green-500 bg-green-50"
                            : isAnswerChecked && selectedOption === index
                              ? "border-red-500 bg-red-50"
                              : ""
                        }`}
                        onClick={() => handleOptionSelect(index)}
                      >
                        <span className="text-sm md:text-base">{option}</span>
                      </div>
                    ))}
                  </div>

                  {isAnswerChecked && (
                    <div
                      className={`p-3 md:p-4 rounded-md ${
                        selectedOption === module.quiz[currentQuestionIndex].correctAnswer
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <div className="flex items-start">
                        {selectedOption === module.quiz[currentQuestionIndex].correctAnswer ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-sm md:text-base">
                            {selectedOption === module.quiz[currentQuestionIndex].correctAnswer
                              ? "Correct!"
                              : "Incorrect"}
                          </p>
                          <p className="text-xs md:text-sm mt-1">{module.quiz[currentQuestionIndex].explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {!isAnswerChecked ? (
                  <Button onClick={checkAnswer} disabled={selectedOption === null} className="w-full">
                    Check Answer
                  </Button>
                ) : (
                  <Button onClick={nextQuestion} className="w-full">
                    {currentQuestionIndex < module.quiz.length - 1 ? "Next Question" : "Complete Quiz"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Quiz Results</CardTitle>
                <CardDescription>
                  You scored {finalScore} out of {module.quiz.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                  <div className="rounded-full bg-primary/10 p-6">
                    {isPerfectScore ? (
                      <CheckCircle className="h-8 w-8 md:h-12 md:w-12 text-green-500" />
                    ) : (
                      <AlertCircle className="h-8 w-8 md:h-12 md:w-12 text-amber-500" />
                    )}
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg md:text-xl font-bold">
                      {isPerfectScore ? "Congratulations!" : "Almost there!"}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {isPerfectScore
                        ? "You've passed the quiz and unlocked the next module!"
                        : "You need to score 100% to unlock the next module. Try again!"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col md:flex-row gap-2 md:justify-between">
                <Button variant="outline" onClick={restartQuiz} className="w-full md:w-auto">
                  Retry Quiz
                </Button>
                <Link href="/engineer" className="w-full md:w-auto">
                  <Button className="w-full">Return to Modules</Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
