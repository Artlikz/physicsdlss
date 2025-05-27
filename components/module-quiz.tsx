"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MotionDiv, fadeIn } from "@/components/motion"
import { CheckCircle, XCircle, AlertCircle, ArrowRight, RotateCcw, Trophy, Star, Sparkles } from "lucide-react"
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
        const passed = finalScore === totalQuestions // Perfect score required

        console.log(`Quiz completed. Score: ${finalScore}/${totalQuestions}, Passed: ${passed}`)

        // Save quiz result
        await saveQuizResult({
          user_id: userId,
          module_id: moduleId,
          career_path: careerPath,
          score: finalScore,
          total_questions: totalQuestions,
          passed: passed,
          time_taken_sec: 0,
        })

        // If passed with perfect score, update user progress
        if (passed) {
          console.log(
            `Perfect score achieved! Updating progress for user ${userId}, path ${careerPath}, module ${moduleId}`,
          )
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
    router.push(`/career-paths/${careerPath}`)
  }

  const isCorrect = selectedOption === currentQuestion.correctAnswer
  const finalScore = score + (isAnswerChecked && selectedOption === currentQuestion.correctAnswer ? 1 : 0)
  const quizPassed = finalScore === totalQuestions // Perfect score required

  return (
    <MotionDiv initial="hidden" animate="visible" variants={fadeIn}>
      {!quizCompleted ? (
        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-purple-800">Quiz Challenge</CardTitle>
                <CardDescription className="text-purple-600">
                  Question {currentQuestionIndex + 1} of {totalQuestions} • Perfect score required to unlock next module
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-purple-600">Score</div>
                <div className="text-2xl font-bold text-purple-800">
                  {score}/{totalQuestions}
                </div>
              </div>
            </div>
            <Progress value={progress} className="h-3 bg-purple-100" />
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="text-lg font-medium mb-4 text-gray-800">{currentQuestion.question}</div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`quiz-option cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedOption === index
                      ? "border-purple-400 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300 hover:bg-purple-25"
                  } 
                    ${isAnswerChecked && index === currentQuestion.correctAnswer ? "border-green-400 bg-green-50" : ""} 
                    ${isAnswerChecked && selectedOption === index && selectedOption !== currentQuestion.correctAnswer ? "border-red-400 bg-red-50" : ""}`}
                  onClick={() => handleOptionSelect(index)}
                >
                  <div className="flex items-start">
                    <div className="inline-flex items-center justify-center rounded-full bg-purple-100 h-6 w-6 mr-3 text-sm font-medium text-purple-700">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex-1">{option}</div>

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
              <Alert className={`${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} mt-4`}>
                <div className="flex items-start">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  )}
                  <div>
                    <AlertTitle className={isCorrect ? "text-green-700" : "text-red-700"}>
                      {isCorrect ? "Excellent!" : "Not quite right"}
                    </AlertTitle>
                    <AlertDescription className={isCorrect ? "text-green-600" : "text-red-600"}>
                      {currentQuestion.explanation}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between bg-gray-50">
            {!isAnswerChecked ? (
              <Button
                onClick={checkAnswer}
                disabled={selectedOption === null}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Check Answer
              </Button>
            ) : (
              <Button onClick={nextQuestion} className="w-full bg-purple-600 hover:bg-purple-700">
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
        <Card className="border-purple-200 shadow-lg">
          <CardHeader
            className={`${quizPassed ? "bg-gradient-to-r from-green-50 to-emerald-50" : "bg-gradient-to-r from-amber-50 to-orange-50"}`}
          >
            <CardTitle className="flex items-center gap-2">
              {quizPassed ? (
                <>
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <span className="text-green-800">Congratulations!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-6 w-6 text-amber-500" />
                  <span className="text-amber-800">Keep Learning!</span>
                </>
              )}
            </CardTitle>
            <CardDescription className={quizPassed ? "text-green-600" : "text-amber-600"}>
              You've completed the quiz for this module
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {isUpdatingProgress ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
                <p className="mt-4 text-gray-600">Saving your progress...</p>
              </div>
            ) : (
              <>
                <div className="text-center py-6">
                  <div
                    className={`inline-flex items-center justify-center rounded-full p-6 mb-4 ${
                      quizPassed ? "bg-green-100" : "bg-amber-100"
                    }`}
                  >
                    {quizPassed ? (
                      <div className="relative">
                        <Trophy className="h-16 w-16 text-yellow-500" />
                        <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                      </div>
                    ) : (
                      <AlertCircle className="h-16 w-16 text-amber-500" />
                    )}
                  </div>

                  {quizPassed ? (
                    <div className="space-y-3">
                      <h2 className="text-3xl font-bold text-green-800 flex items-center justify-center gap-2">
                        🎉 Amazing Work! 🎉
                      </h2>
                      <p className="text-lg text-green-700 font-medium">
                        Perfect score achieved! You've mastered this module!
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                        <div className="flex items-center justify-center gap-2 text-green-800">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <span className="font-medium">Module Unlocked!</span>
                          <Star className="h-5 w-5 text-yellow-500" />
                        </div>
                        <p className="text-green-700 text-sm mt-1">
                          You can now proceed to the next exciting module in your learning journey!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-amber-800">Almost There!</h2>
                      <p className="text-amber-700">You need a perfect score (100%) to unlock the next module.</p>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                        <p className="text-amber-800 font-medium">💡 Study Tip:</p>
                        <p className="text-amber-700 text-sm mt-1">
                          Review the module content carefully and try again. You've got this!
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="text-4xl font-bold mb-6 mt-4">
                    {finalScore}/{totalQuestions}
                    <span className="text-lg text-gray-500 ml-2">
                      ({Math.round((finalScore / totalQuestions) * 100)}%)
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
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 bg-gray-50">
            <Button
              onClick={restartQuiz}
              variant={quizPassed ? "outline" : "default"}
              className={`w-full ${!quizPassed ? "bg-purple-600 hover:bg-purple-700" : "border-purple-300 text-purple-700 hover:bg-purple-50"}`}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            {quizPassed && (
              <Button onClick={continueToNextModule} className="w-full bg-green-600 hover:bg-green-700">
                Continue Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </MotionDiv>
  )
}
