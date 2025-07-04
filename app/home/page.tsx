import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Play, History, Settings } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
            Choose an option below to start practicing your interview skills
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Button variant="outline" className="w-full bg-transparent" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Settings className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Settings</CardTitle>
              <CardDescription>Customize your interview preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Interviews Taken</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">0%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Average Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Domains Practiced</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">0h</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Practice Time</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
