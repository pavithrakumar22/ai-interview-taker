"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  type: "question" | "answer"
  content: string
}

interface InterviewState {
  domain: string
  experience: string
  techs: string[]
  messages: Message[]
  currentPhase: "technologies" | "projects"
  currentTechIndex: number
  questionCount: number
  projects: string[]
  isComplete: boolean
}

export default function InterviewChat() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [interviewData, setInterviewData] = useState<InterviewState>({
    domain: searchParams.get("domain") || "",
    experience: searchParams.get("experience") || "",
    techs: searchParams.get("techs")?.split(",") || [],
    messages: [],
    currentPhase: "technologies",
    currentTechIndex: 0,
    questionCount: 0,
    projects: [],
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
          currentPhase: interviewData.currentPhase,
          currentTechIndex: interviewData.currentTechIndex,
          questionCount: interviewData.questionCount,
          projects: interviewData.projects,
        }),
      })

      const data = await response.json()

      // Check if we should continue or end the interview
      const shouldContinue = data.nextQuestion

      if (shouldContinue) {
        // Add next question
        const nextQuestionMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "question",
          content: data.nextQuestion,
        }

        setInterviewData((prev) => ({
          ...prev,
          messages: [...prev.messages, nextQuestionMessage],
          currentPhase: data.currentPhase || prev.currentPhase,
          currentTechIndex: data.currentTechIndex || prev.currentTechIndex,
          questionCount: data.questionCount || prev.questionCount + 1,
        }))

        // If moving to projects phase, extract project names from user answer
        if (data.currentPhase === "projects" && interviewData.currentPhase === "technologies") {
          const projectNames = extractProjectNames(userAnswer)
          setInterviewData((prev) => ({
            ...prev,
            projects: projectNames,
          }))
        }
      } else {
        // Interview is complete
        const updatedData = {
          ...interviewData,
          questionCount: interviewData.questionCount + 1,
          isComplete: true,
        }
        setInterviewData(updatedData)
        await saveInterviewResults(updatedData)
      }
    } catch (error) {
      console.error("Error submitting answer:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to extract project names
  const extractProjectNames = (answer: string): string[] => {
    // Simple extraction - you can make this more sophisticated
    const projects = answer
      .split(/[,\n]/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
    return projects.slice(0, 3) // Limit to 3 projects
  }

  const saveInterviewResults = async (finalData: InterviewState) => {
    try {
      console.log("💾 Saving interview results...")

      // Format interview data for backend
      const interviewResults = []

      for (let i = 0; i < finalData.messages.length; i += 2) {
        const questionMessage = finalData.messages[i]
        const answerMessage = finalData.messages[i + 1]

        if (
          questionMessage &&
          answerMessage &&
          questionMessage.type === "question" &&
          answerMessage.type === "answer"
        ) {
          interviewResults.push({
            question: questionMessage.content,
            userAnswer: answerMessage.content,
            score: Math.floor(Math.random() * 4) + 6, // Random score 6-10 for demo
            feedback: "AI feedback will be generated based on your answer.",
            idealAnswer: "Ideal answer will be provided by the AI system.",
          })
        }
      }

      const resultData = {
        role: finalData.domain,
        techs: finalData.techs,
        projects: finalData.projects,
        experience: finalData.experience,
        interview: interviewResults,
      }

      console.log("📤 Sending data to API:", resultData)

      const response = await fetch("/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ API Error:", errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      const savedResult = await response.json()
      console.log("✅ Interview saved successfully:", savedResult)

      // Store the result ID for the results page
      localStorage.setItem("interviewResultId", savedResult._id || "")
    } catch (error) {
      console.error("❌ Error saving interview results:", error)
      alert("There was an error saving your interview. Please try again.")
    }
  }

  const handleViewResults = () => {
    router.push("/interview/results")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
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
            <Badge variant="outline">
              {interviewData.currentPhase === "technologies"
                ? `Tech Questions: ${interviewData.questionCount}/${interviewData.techs.length * 3}`
                : `Project Questions: ${interviewData.questionCount - interviewData.techs.length * 3}/3`}
            </Badge>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center">
                AI Interview Session
                {interviewData.isComplete && <CheckCircle className="h-5 w-5 text-green-600 ml-2" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {interviewData.messages.map((message) => (
                  <div key={message.id}>
                    {message.type === "question" && (
                      <div className="flex justify-start">
                        <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 p-4 rounded-lg max-w-[80%] break-words">
                          <div className="font-medium text-sm mb-2">AI Interviewer</div>
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                        </div>
                      </div>
                    )}

                    {message.type === "answer" && (
                      <div className="flex justify-end">
                        <div className="bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 p-4 rounded-lg max-w-[80%] break-words">
                          <div className="font-medium text-sm mb-2">Your Answer</div>
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
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
              <div className="flex-shrink-0">
                {!interviewData.isComplete ? (
                  <div className="flex space-x-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your answer here..."
                      onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSubmitAnswer()}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button onClick={handleSubmitAnswer} disabled={isLoading || !input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg font-medium text-green-600">Interview Complete! 🎉</div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Your responses have been saved. Click below to view your detailed results and download your
                      report.
                    </p>
                    <Button onClick={handleViewResults} size="lg">
                      View Results & Download Report
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
