"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Send, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  type: "question" | "answer" | "feedback"
  content: string
  score?: string
  idealAnswer?: string
  feedback?: string
}

interface InterviewData {
  domain: string
  experience: string
  techs: string[]
  messages: Message[]
  currentQuestionIndex: number
  isComplete: boolean
}

export default function InterviewChat() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [interviewData, setInterviewData] = useState<InterviewData>({
    domain: searchParams.get("domain") || "",
    experience: searchParams.get("experience") || "",
    techs: searchParams.get("techs")?.split(",") || [],
    messages: [],
    currentQuestionIndex: 0,
    isComplete: false,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [interviewData.messages])

  useEffect(() => {
    // Start the interview by getting the first question
    if (interviewData.messages.length === 0) {
      getFirstQuestion()
    }
  }, [])

  const getFirstQuestion = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: interviewData.domain,
          techs: interviewData.techs,
          question: null,
          userAnswer: null,
        }),
      })

      const data = await response.json()

      setInterviewData((prev) => ({
        ...prev,
        messages: [
          {
            id: "1",
            type: "question",
            content: data.question,
          },
        ],
      }))
    } catch (error) {
      console.error("Error getting first question:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!input.trim() || isLoading) return

    const currentQuestion = interviewData.messages[interviewData.messages.length - 1]?.content
    const userAnswer = input.trim()

    // Add user answer to messages
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: "answer",
      content: userAnswer,
    }

    setInterviewData((prev) => ({
      ...prev,
      messages: [...prev.messages, newUserMessage],
    }))

    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: interviewData.domain,
          techs: interviewData.techs,
          question: currentQuestion,
          userAnswer: userAnswer,
        }),
      })

      const data = await response.json()

      // Add feedback message
      const feedbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "feedback",
        content: data.feedback || "Thank you for your answer!",
        score: data.score,
        idealAnswer: data.idealAnswer,
        feedback: data.feedback,
      }

      const newMessages = [feedbackMessage]

      // Add next question if available
      if (data.nextQuestion && interviewData.currentQuestionIndex < 4) {
        // Limit to 5 questions
        const nextQuestionMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: "question",
          content: data.nextQuestion,
        }
        newMessages.push(nextQuestionMessage)
      }

      const updatedData = {
        ...interviewData,
        messages: [...interviewData.messages, ...newMessages],
        currentQuestionIndex: interviewData.currentQuestionIndex + 1,
        isComplete: !data.nextQuestion || interviewData.currentQuestionIndex >= 4,
      }

      setInterviewData(updatedData)

      // If interview is complete, save to backend
      if (!data.nextQuestion || interviewData.currentQuestionIndex >= 4) {
        await saveInterviewResults(updatedData)
      }
    } catch (error) {
      console.error("Error submitting answer:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveInterviewResults = async (finalData: InterviewData) => {
    try {
      // Format interview data for backend
      const interviewResults = []

      for (let i = 0; i < finalData.messages.length; i++) {
        const message = finalData.messages[i]
        if (message.type === "question") {
          const answer = finalData.messages[i + 1]
          const feedback = finalData.messages[i + 2]

          if (answer && feedback) {
            interviewResults.push({
              question: message.content,
              userAnswer: answer.content,
              score: feedback.score?.match(/(\d+)/)?.[1] || "0",
              feedback: feedback.content,
              idealAnswer: feedback.idealAnswer || "",
            })
          }
        }
      }

      const resultData = {
        role: finalData.domain,
        techs: finalData.techs,
        projects: [], // You can add projects if needed
        experience: finalData.experience,
        interview: interviewResults,
      }

      const response = await fetch("/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultData),
      })

      const savedResult = await response.json()

      // Store the result ID for the results page
      localStorage.setItem("interviewResultId", savedResult._id || "")
      localStorage.setItem(
        "interviewResults",
        JSON.stringify({
          ...finalData,
          savedResult,
        }),
      )
    } catch (error) {
      console.error("Error saving interview results:", error)
    }
  }

  const handleViewResults = () => {
    // Store interview data in localStorage for results page
    localStorage.setItem("interviewResults", JSON.stringify(interviewData))
    router.push("/interview/results")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/interview/setup">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">
              {interviewData.domain} - {interviewData.experience} years
            </Badge>
            <Badge variant="outline">Question {interviewData.currentQuestionIndex + 1}/5</Badge>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="h-[75vh] max-h-[800px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                AI Interview Session
                {interviewData.isComplete && <CheckCircle className="h-5 w-5 text-green-600 ml-2" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {interviewData.messages.map((message) => (
                  <div key={message.id}>
                    {message.type === "question" && (
                      <div className="flex justify-start">
                        <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 p-4 rounded-lg max-w-[85%] break-words">
                          <div className="font-medium text-sm mb-2">AI Interviewer</div>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                      </div>
                    )}

                    {message.type === "answer" && (
                      <div className="flex justify-end">
                        <div className="bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 p-4 rounded-lg max-w-[85%] break-words">
                          <div className="font-medium text-sm mb-2">Your Answer</div>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                      </div>
                    )}

                    {message.type === "feedback" && (
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-w-full break-words">
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <div className="font-medium text-sm">Feedback</div>
                          {message.score && <Badge variant="secondary">Score: {message.score}</Badge>}
                        </div>
                        <div className="text-sm space-y-2">
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          {message.idealAnswer && (
                            <>
                              <Separator />
                              <div className="whitespace-pre-wrap">
                                <strong>Ideal Answer:</strong> {message.idealAnswer}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              {!interviewData.isComplete ? (
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your answer here..."
                    onKeyPress={(e) => e.key === "Enter" && handleSubmitAnswer()}
                    disabled={isLoading}
                  />
                  <Button onClick={handleSubmitAnswer} disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-lg font-medium text-green-600">Interview Complete! 🎉</div>
                  <Button onClick={handleViewResults} size="lg">
                    View Results & Download Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
