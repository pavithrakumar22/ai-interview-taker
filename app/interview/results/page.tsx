"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Home, RotateCcw } from "lucide-react"
import Link from "next/link"

interface InterviewResults {
  domain: string
  experience: string
  techs: string[]
  messages: any[]
  currentQuestionIndex: number
  isComplete: boolean
}

export default function ResultsPage() {
  const [results, setResults] = useState<InterviewResults | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedResults = localStorage.getItem("interviewResults")
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    } else {
      router.push("/home")
    }
  }, [router])

  const calculateStats = () => {
    if (!results) return { averageScore: 0, totalQuestions: 0, answeredQuestions: 0 }

    const feedbackMessages = results.messages.filter((m) => m.type === "feedback" && m.score)
    const scores = feedbackMessages.map((m) => {
      const scoreMatch = m.score?.match(/(\d+)/)
      return scoreMatch ? Number.parseInt(scoreMatch[1]) : 0
    })

    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    const totalQuestions = results.messages.filter((m) => m.type === "question").length
    const answeredQuestions = results.messages.filter((m) => m.type === "answer").length

    return { averageScore, totalQuestions, answeredQuestions }
  }

  const generatePDF = async () => {
    setIsGeneratingPDF(true)

    try {
      if (!results) return

      // Format data for PDF generation
      const pdfData = {
        role: results.domain,
        techs: results.techs,
        experience: results.experience,
        interview: formatInterviewForPDF(results.messages),
        summary: {
          totalQuestions: calculateStats().totalQuestions,
          averageScore: calculateStats().averageScore,
          answeredQuestions: calculateStats().answeredQuestions,
        },
      }

      const response = await fetch("/api/result/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pdfData),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `interview-report-${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error("Failed to generate PDF")
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const formatInterviewForPDF = (messages: any[]) => {
    const interviewData = []

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i]
      if (message.type === "question") {
        const answer = messages[i + 1]
        const feedback = messages[i + 2]

        if (answer && feedback) {
          interviewData.push({
            question: message.content,
            userAnswer: answer.content,
            score: feedback.score?.match(/(\d+)/)?.[1] || "0",
            feedback: feedback.content,
            idealAnswer: feedback.idealAnswer || "",
          })
        }
      }
    }

    return interviewData
  }

  const generatePDFContent = () => {
    if (!results) return ""

    const stats = calculateStats()
    let content = `AI INTERVIEW REPORT\n`
    content += `==================\n\n`
    content += `Domain: ${results.domain}\n`
    content += `Experience Level: ${results.experience} years\n`
    content += `Technologies: ${results.techs.join(", ")}\n`
    content += `Date: ${new Date().toLocaleDateString()}\n\n`
    content += `PERFORMANCE SUMMARY\n`
    content += `==================\n`
    content += `Questions Answered: ${stats.answeredQuestions}/${stats.totalQuestions}\n`
    content += `Average Score: ${stats.averageScore.toFixed(1)}/10\n\n`
    content += `DETAILED FEEDBACK\n`
    content += `================\n\n`

    let questionNumber = 1
    for (let i = 0; i < results.messages.length; i++) {
      const message = results.messages[i]
      if (message.type === "question") {
        content += `Question ${questionNumber}: ${message.content}\n`

        // Find corresponding answer and feedback
        const answer = results.messages[i + 1]
        const feedback = results.messages[i + 2]

        if (answer && answer.type === "answer") {
          content += `Your Answer: ${answer.content}\n`
        }

        if (feedback && feedback.type === "feedback") {
          content += `Score: ${feedback.score || "N/A"}\n`
          content += `Feedback: ${feedback.content}\n`
          if (feedback.idealAnswer) {
            content += `Ideal Answer: ${feedback.idealAnswer}\n`
          }
        }

        content += `\n${"-".repeat(50)}\n\n`
        questionNumber++
      }
    }

    return content
  }

  if (!results) {
    return <div>Loading...</div>
  }

  const stats = calculateStats()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link href="/home">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <div className="flex space-x-2">
              <Link href="/interview/setup">
                <Button variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Take Another Interview
                </Button>
              </Link>
              <Link href="/home">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>

          {/* Results Header */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Interview Results</CardTitle>
              <CardDescription>Here's how you performed in your {results.domain} interview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{results.domain}</Badge>
                <Badge variant="outline">{results.experience} years experience</Badge>
                {results.techs.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overall Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.averageScore.toFixed(1)}/10</div>
                <Progress value={stats.averageScore * 10} className="mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Average across all questions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.answeredQuestions}/{stats.totalQuestions}
                </div>
                <Progress value={(stats.answeredQuestions / stats.totalQuestions) * 100} className="mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Interview completion rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats.averageScore >= 8
                    ? "Excellent"
                    : stats.averageScore >= 6
                      ? "Good"
                      : stats.averageScore >= 4
                        ? "Fair"
                        : "Needs Improvement"}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Based on your responses</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Feedback */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Detailed Question Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {results.messages.map((message, index) => {
                if (message.type === "question") {
                  const answer = results.messages[index + 1]
                  const feedback = results.messages[index + 2]
                  const questionNumber =
                    results.messages.slice(0, index).filter((m) => m.type === "question").length + 1

                  return (
                    <div key={message.id} className="space-y-3">
                      <div className="font-medium text-blue-600">
                        Question {questionNumber}: {message.content}
                      </div>

                      {answer && answer.type === "answer" && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                          <div className="font-medium text-sm text-green-700 dark:text-green-300 mb-1">
                            Your Answer:
                          </div>
                          <div className="text-sm">{answer.content}</div>
                        </div>
                      )}

                      {feedback && feedback.type === "feedback" && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm">Feedback:</div>
                            {feedback.score && <Badge variant="secondary">Score: {feedback.score}</Badge>}
                          </div>
                          <div className="text-sm">{feedback.content}</div>
                          {feedback.idealAnswer && (
                            <>
                              <Separator />
                              <div className="text-sm">
                                <strong>Ideal Answer:</strong> {feedback.idealAnswer}
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {index < results.messages.length - 1 && <Separator />}
                    </div>
                  )
                }
                return null
              })}
            </CardContent>
          </Card>

          {/* Download Report */}
          <Card>
            <CardHeader>
              <CardTitle>Download Report</CardTitle>
              <CardDescription>Get a detailed PDF report of your interview performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={generatePDF} disabled={isGeneratingPDF} size="lg" className="w-full md:w-auto">
                {isGeneratingPDF ? (
                  <>Generating Report...</>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
