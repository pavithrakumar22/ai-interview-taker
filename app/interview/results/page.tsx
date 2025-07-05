"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Download, Home, RotateCcw, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"

interface InterviewResults {
  _id: string
  role: string
  experience: string
  techs: string[]
  averageScore: string
  totalQuestions: number
  summary: {
    strengths: string
    weaknesses: string
  }
  fullInterview: Array<{
    question: string
    userAnswer: string
    score: string
    feedback: string
    idealAnswer: string
  }>
}

export default function ResultsPage() {
  const [results, setResults] = useState<InterviewResults | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const interviewId = localStorage.getItem("interviewResultId")
        if (!interviewId) {
          router.push("/home")
          return
        }

        const response = await fetch(`/api/my-results?id=${interviewId}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data)
        } else {
          console.error("Failed to fetch results")
          router.push("/home")
        }
      } catch (error) {
        console.error("Error fetching results:", error)
        router.push("/home")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [router])

  const generatePDF = async () => {
    if (!results) return

    setIsGeneratingPDF(true)
    setPdfError(null)

    try {
      console.log("🔄 Starting PDF generation...")

      const response = await fetch("/api/result/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: results.role,
          techs: results.techs,
          experience: results.experience,
          averageScore: results.averageScore,
          summary: results.summary,
          interview: results.fullInterview,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `interview-report-${results.role}-${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        console.log("✅ PDF downloaded successfully")
      } else {
        const errorData = await response.json()
        console.error("❌ PDF generation failed:", errorData)
        setPdfError(errorData.details || "Failed to generate PDF. Please try again.")
      }
    } catch (error) {
      console.error("❌ Error generating PDF:", error)
      setPdfError("Network error occurred. Please check your connection and try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your results...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p>No results found. Please take an interview first.</p>
          <Link href="/home">
            <Button className="mt-4">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const averageScore = Number.parseFloat(results.averageScore) || 0

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
              <CardDescription>Here's how you performed in your {results.role} interview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{results.role}</Badge>
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
                <div className="text-3xl font-bold text-blue-600 mb-2">{averageScore.toFixed(1)}/10</div>
                <Progress value={averageScore * 10} className="mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Average across all questions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">{results.totalQuestions}</div>
                <Progress value={100} className="mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Interview completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {averageScore >= 8
                    ? "Excellent"
                    : averageScore >= 6
                      ? "Good"
                      : averageScore >= 4
                        ? "Fair"
                        : "Needs Improvement"}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Based on your responses</p>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Strengths</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{results.summary.strengths}</p>
              </div>
              <div>
                <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">Areas for Improvement</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{results.summary.weaknesses}</p>
              </div>
            </CardContent>
          </Card>

          {/* Download Report */}
          <Card>
            <CardHeader>
              <CardTitle>Download Detailed Report</CardTitle>
              <CardDescription>
                Get a comprehensive PDF report with all questions, answers, feedback, and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pdfError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{pdfError}</AlertDescription>
                </Alert>
              )}
              <Button onClick={generatePDF} disabled={isGeneratingPDF} size="lg" className="w-full md:w-auto">
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Report...
                  </>
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
