"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MotionDiv, fadeIn } from "@/components/motion"
import { CheckCircle, XCircle, AlertCircle, ArrowRight, RotateCcw } from "lucide-react"
import { saveQuizResult, updateUserProgress } from "@/lib/db-service"
import { useRouter } from "next/navigation"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface ModuleQuizProps {
  quiz: {
    questions: Question[]
  }
  moduleId: number
  careerPath: string
  userId: string
}

export function ModuleQuiz({ quiz, moduleId, careerPath, userId }: ModuleQuizProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false)
  const [progressUpdateError, setProgressUpdateError] = useState<string | null>(null)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  const handleOptionSelect = (optionIndex: number) => {
    if (!isAnswerChecked) {
      setSelectedOption(optionIndex)
    }
  }

  const checkAnswer = () => {
    if (selectedOption === null) return

    setIsAnswerChecked(true)

    // Update user answers
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestionIndex] = selectedOption
    setUserAnswers(newUserAnswers)

    // Update score if correct
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = async () => {
    setSelectedOption(null)
    setIsAnswerChecked(false)

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Quiz completed
      setQuizCompleted(true)
      setIsUpdatingProgress(true)
      setProgressUpdateError(null)

      try {
        // Calculate final score including current question
        const finalScore = score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0)
        const passed = finalScore >= Math.ceil(totalQuestions * 0.7) // 70% passing score

        console.log(`Quiz completed. Score: ${finalScore}/${totalQuestions}, Passed: ${passed}`)

        // Save quiz result
        await saveQuizResult({
          user_id: userId,
          module_id: moduleId,
          career_path: careerPath,
          score: finalScore,
          total_questions: totalQuestions,
          passed: passed,
          time_taken_sec: 0, // We're not tracking time in this implementation
        })

        // If passed, update user progress
        if (passed) {
          console.log(`Updating progress for user ${userId}, path ${careerPath}, module ${moduleId}`)
          const result = await updateUserProgress(userId, careerPath, moduleId)
          console.log("Progress update result:", result)

          if (!result) {
            throw new Error("Failed to update progress")
          }

          // Force a router refresh to update the UI
          router.refresh()
        }
      } catch (error) {
        console.error("Error saving quiz results or updating progress:", error)
        setProgressUpdateError("There was an error saving your progress. Please try again.")
      } finally {
        setIsUpdatingProgress(false)
      }
    }
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setIsAnswerChecked(false)
    setScore(0)
    setQuizCompleted(false)
    setUserAnswers([])
    setProgressUpdateError(null)
  }

  const continueToNextModule = () => {
    // Force refresh before navigating
    router.refresh()
    router.push(`/${careerPath}`)
  }

  const isCorrect = selectedOption === currentQuestion.correctAnswer
  const quizPassed = score >= Math.ceil(totalQuestions * 0.7) // 70% passing score

  return (
    <MotionDiv initial="hidden" animate="visible" variants={fadeIn}>
      {!quizCompleted ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Quiz Challenge</CardTitle>
                <CardDescription>
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">Score</div>
                <div className="text-2xl font-bold">
                  {score}/{totalQuestions}
                </div>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg font-medium mb-4">{currentQuestion.question}</div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`quiz-option ${selectedOption === index ? "selected" : ""} 
                    ${isAnswerChecked && index === currentQuestion.correctAnswer ? "correct" : ""} 
                    ${isAnswerChecked && selectedOption === index && selectedOption !== currentQuestion.correctAnswer ? "incorrect" : ""}`}
                  onClick={() => handleOptionSelect(index)}
                >
                  <div className="flex items-start">
                    <div className="inline-flex items-center justify-center rounded-full bg-secondary h-6 w-6 mr-2 text-sm">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div>{option}</div>

                    {isAnswerChecked && (
                      <div className="ml-auto">
                        {index === currentQuestion.correctAnswer ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : selectedOption === index ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isAnswerChecked && (
              <Alert className={isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                <div className="flex items-start">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  )}
                  <div>
                    <AlertTitle className={isCorrect ? "text-green-700" : "text-red-700"}>
                      {isCorrect ? "Correct!" : "Incorrect"}
                    </AlertTitle>
                    <AlertDescription className={isCorrect ? "text-green-600" : "text-red-600"}>
                      {currentQuestion.explanation}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {!isAnswerChecked ? (
              <Button onClick={checkAnswer} disabled={selectedOption === null} className="w-full">
                Check Answer
              </Button>
            ) : (
              <Button onClick={nextQuestion} className="w-full">
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <>
                    Next Question <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Complete Quiz <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>You've completed the quiz for this module</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isUpdatingProgress ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <p className="mt-4 text-muted-foreground">Saving your progress...</p>
              </div>
            ) : (
              <>
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 mb-4">
                    {quizPassed ? (
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    ) : (
                      <AlertCircle className="h-12 w-12 text-amber-500" />
                    )}
                  </div>

                  <h2 className="text-2xl font-bold mb-2">{quizPassed ? "Congratulations!" : "Almost there!"}</h2>

                  <p className="text-muted-foreground mb-4">
                    {quizPassed
                      ? "You've passed the quiz and can now proceed to the next module."
                      : "You need to score at least 70% to unlock the next module. Try again!"}
                  </p>

                  <div className="text-4xl font-bold mb-6">
                    {score}/{totalQuestions}
                    <span className="text-lg text-muted-foreground ml-2">
                      ({Math.round((score / totalQuestions) * 100)}%)
                    </span>
                  </div>
                </div>

                {progressUpdateError && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <AlertTitle className="text-red-700">Error</AlertTitle>
                    <AlertDescription className="text-red-600">{progressUpdateError}</AlertDescription>
                  </Alert>
                )}

                {!quizPassed && (
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <AlertTitle className="text-amber-700">Review Required</AlertTitle>
                    <AlertDescription className="text-amber-600">
                      You need to score at least 70% to unlock the next module. Review the content and try again.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button onClick={restartQuiz} variant={quizPassed ? "outline" : "default"} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry Quiz
            </Button>

            {quizPassed && (
              <Button onClick={continueToNextModule} className="w-full">
                Continue Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </MotionDiv>
  )
}
