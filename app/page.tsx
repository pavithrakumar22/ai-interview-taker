import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, CheckCircle, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function HeroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Brain className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">AI Interview Taker</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Practice technical interviews with our AI-powered platform. Get real-time feedback and improve your
            interview skills across various domains.
          </p>
        </header>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Real-time AI Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get instant feedback on your answers with detailed explanations and improvement suggestions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Multiple Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Practice interviews for various tech domains including Frontend, Backend, DevOps, and more.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Detailed Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Download comprehensive PDF reports with your performance analysis and recommendations.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <SignedOut>
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Ready to Start?</CardTitle>
                <CardDescription>Sign in to begin your AI-powered interview practice</CardDescription>
              </CardHeader>
              <CardContent>
                <SignInButton mode="modal">
                  <Button size="lg" className="w-full">
                    Get Started - Sign In
                  </Button>
                </SignInButton>
              </CardContent>
            </Card>
          </SignedOut>

          <SignedIn>
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Welcome Back!</CardTitle>
                <CardDescription>Ready to practice your next interview?</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/home">
                  <Button size="lg" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </SignedIn>
        </div>
      </div>
    </div>
  )
}
