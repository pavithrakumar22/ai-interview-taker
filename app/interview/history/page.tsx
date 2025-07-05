"use client"

import { useState, useEffect } from "react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, Calendar, Target, FileText } from "lucide-react"
import Link from "next/link"

interface InterviewHistory {
  _id: string
  role: string
  techs: string[]
  averageScore: string
  totalQuestions: number
  createdAt: string
}

interface UserStats {
  totalInterviews: number
  averageScore: string
  domainsPracticed: number
  practiceTime: string
  recentInterviews: InterviewHistory[]
  uniqueDomains: string[]
}

export default function InterviewHistoryPage() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/user-stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          console.error("Failed to fetch stats:", response.status)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleViewResult = (interviewId: string) => {
    localStorage.setItem("interviewResultId", interviewId)
    window.location.href = "/interview/results"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Loading your interview history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interview History</h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/home">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats?.totalInterviews || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Interviews</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats?.averageScore || 0}/10</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Average Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats?.domainsPracticed || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Domains Practiced</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats?.practiceTime || "0m"}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Practice Time</div>
              </CardContent>
            </Card>
          </div>

          {/* Domains Practiced */}
          {stats?.uniqueDomains && stats.uniqueDomains.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Domains You've Practiced</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {stats.uniqueDomains.map((domain) => (
                    <Badge key={domain} variant="secondary">
                      {domain}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Interviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Interviews</CardTitle>
              <CardDescription>Your latest interview sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.recentInterviews && stats.recentInterviews.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentInterviews.map((interview) => (
                    <div
                      key={interview._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{interview.role}</Badge>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(interview.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center">
                            <Target className="h-4 w-4 mr-1 text-green-600" />
                            Score: {interview.averageScore}/10
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1 text-blue-600" />
                            {interview.totalQuestions} questions
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {interview.techs.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {interview.techs.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{interview.techs.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleViewResult(interview._id)}>
                        View Results
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">No interviews taken yet</p>
                  <Link href="/interview/setup">
                    <Button>Take Your First Interview</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
