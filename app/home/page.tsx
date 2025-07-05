"use client"

import { useState, useEffect } from "react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Play, History, BookOpen, Target, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"

interface UserStats {
  totalInterviews: number
  averageScore: string
  domainsPracticed: number
  practiceTime: string
}

export default function HomePage() {
  const [stats, setStats] = useState<UserStats>({
    totalInterviews: 0,
    averageScore: "0",
    domainsPracticed: 0,
    practiceTime: "0m",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/user-stats")
        if (response.ok) {
          const data = await response.json()
          setStats({
            totalInterviews: data.totalInterviews,
            averageScore: data.averageScore,
            domainsPracticed: data.domainsPracticed,
            practiceTime: data.practiceTime,
          })
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Interview Taker</h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Your Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Track your progress and continue improving your interview skills
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Start New Interview */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Play className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Start New Interview</CardTitle>
              <CardDescription>Begin a new AI-powered interview session</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/interview/setup">
                <Button className="w-full">Start Interview</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Interview History */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <History className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Interview History</CardTitle>
              <CardDescription>View your past interview sessions and results</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/interview/history">
                <Button variant="outline" className="w-full bg-transparent">
                  View History
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Interview Preparation */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Interview Preparation</CardTitle>
              <CardDescription>Study guides, tips, and practice questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/interview/preparation">
                <Button variant="outline" className="w-full bg-transparent">
                  Start Preparing
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Progress</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-blue-600 mr-2" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{isLoading ? "..." : stats.totalInterviews}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Interviews Taken</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {isLoading ? "..." : `${stats.averageScore}/10`}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Average Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="h-5 w-5 text-purple-600 mr-2" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{isLoading ? "..." : stats.domainsPracticed}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Domains Practiced</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-orange-600 mr-2" />
                </div>
                <div className="text-2xl font-bold text-orange-600">{isLoading ? "..." : stats.practiceTime}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Practice Time</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tips Section */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Interview Tips</CardTitle>
            <CardDescription>Quick tips to improve your interview performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">Before the Interview:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Review fundamental concepts in your chosen technologies</li>
                  <li>• Practice explaining complex topics in simple terms</li>
                  <li>• Prepare examples from your past projects</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">During the Interview:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Take your time to think before answering</li>
                  <li>• Provide specific examples when possible</li>
                  <li>• Don&apos;tt hesitate to ask for clarification</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
