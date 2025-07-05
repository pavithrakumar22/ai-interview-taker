"use client"

import { useState } from "react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Brain, ArrowLeft, BookOpen, CheckCircle, Clock, Code, Lightbulb, Target, Users, Zap } from "lucide-react"
import Link from "next/link"

const preparationTopics = {
  frontend: [
    {
      category: "JavaScript Fundamentals",
      topics: [
        "Closures and Scope",
        "Promises and Async/Await",
        "Event Loop and Callbacks",
        "Prototypes and Inheritance",
        "ES6+ Features",
      ],
    },
    {
      category: "React/Framework Concepts",
      topics: [
        "Component Lifecycle",
        "State Management",
        "Hooks (useState, useEffect, custom hooks)",
        "Context API",
        "Performance Optimization",
      ],
    },
    {
      category: "CSS & Styling",
      topics: ["Flexbox and Grid", "Responsive Design", "CSS-in-JS", "Animations", "Browser Compatibility"],
    },
  ],
  backend: [
    {
      category: "Server Architecture",
      topics: [
        "RESTful API Design",
        "Microservices vs Monolith",
        "Load Balancing",
        "Caching Strategies",
        "Database Design",
      ],
    },
    {
      category: "Security",
      topics: ["Authentication & Authorization", "HTTPS/TLS", "SQL Injection Prevention", "CORS", "Rate Limiting"],
    },
    {
      category: "Performance",
      topics: ["Database Optimization", "Query Performance", "Memory Management", "Scalability", "Monitoring"],
    },
  ],
  fullstack: [
    {
      category: "System Design",
      topics: [
        "Database Schema Design",
        "API Architecture",
        "Frontend-Backend Communication",
        "State Management",
        "Deployment Strategies",
      ],
    },
    {
      category: "DevOps & Tools",
      topics: ["CI/CD Pipelines", "Docker & Containerization", "Cloud Services", "Version Control", "Testing"],
    },
  ],
}

const commonQuestions = [
  {
    category: "Technical",
    questions: [
      "Explain the difference between let, const, and var in JavaScript",
      "What is the virtual DOM and how does it work?",
      "How would you optimize a slow database query?",
      "Describe the MVC architecture pattern",
      "What are the principles of RESTful API design?",
    ],
  },
  {
    category: "Behavioral",
    questions: [
      "Tell me about a challenging project you worked on",
      "How do you handle tight deadlines?",
      "Describe a time you had to learn a new technology quickly",
      "How do you approach debugging complex issues?",
      "Tell me about a time you disagreed with a team member",
    ],
  },
  {
    category: "Problem Solving",
    questions: [
      "How would you design a URL shortener like bit.ly?",
      "Explain how you would implement a chat application",
      "Design a system to handle millions of users",
      "How would you optimize a web page for performance?",
      "Describe your approach to testing a new feature",
    ],
  },
]

const studyPlan = [
  {
    week: 1,
    focus: "Fundamentals Review",
    tasks: ["Review core concepts", "Practice basic problems", "Set up study schedule"],
  },
  {
    week: 2,
    focus: "Technical Deep Dive",
    tasks: ["Study advanced topics", "Build sample projects", "Practice coding problems"],
  },
  {
    week: 3,
    focus: "System Design",
    tasks: ["Learn design patterns", "Practice system design", "Review architecture concepts"],
  },
  { week: 4, focus: "Mock Interviews", tasks: ["Take practice interviews", "Review feedback", "Polish weak areas"] },
]

export default function InterviewPreparation() {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({})
  const [selectedDomain, setSelectedDomain] = useState("frontend")

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getProgress = (topics: any[]) => {
    const totalItems = topics.reduce((sum, category) => sum + category.topics.length, 0)
    const checkedCount = topics.reduce(
      (sum, category) =>
        sum + category.topics.filter((topic: string) => checkedItems[`${category.category}-${topic}`]).length,
      0,
    )
    return totalItems > 0 ? (checkedCount / totalItems) * 100 : 0
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Preparation</h1>
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

          {/* Overview Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-semibold">Study Topics</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Comprehensive coverage</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-semibold">Practice Questions</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Real interview scenarios</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-semibold">Study Plan</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">4-week preparation</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-lg font-semibold">Quick Tips</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Expert advice</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="topics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="topics">Study Topics</TabsTrigger>
              <TabsTrigger value="questions">Practice Questions</TabsTrigger>
              <TabsTrigger value="plan">Study Plan</TabsTrigger>
              <TabsTrigger value="tips">Interview Tips</TabsTrigger>
            </TabsList>

            {/* Study Topics */}
            <TabsContent value="topics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Topics by Domain</CardTitle>
                  <CardDescription>Check off topics as you study them to track your progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-6">
                    {Object.keys(preparationTopics).map((domain) => (
                      <Button
                        key={domain}
                        variant={selectedDomain === domain ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDomain(domain)}
                      >
                        {domain.charAt(0).toUpperCase() + domain.slice(1)}
                      </Button>
                    ))}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-gray-600">
                        {Math.round(getProgress(preparationTopics[selectedDomain as keyof typeof preparationTopics]))}%
                      </span>
                    </div>
                    <Progress
                      value={getProgress(preparationTopics[selectedDomain as keyof typeof preparationTopics])}
                    />
                  </div>

                  <div className="space-y-6">
                    {preparationTopics[selectedDomain as keyof typeof preparationTopics]?.map((category) => (
                      <div key={category.category}>
                        <h3 className="font-semibold text-lg mb-3 flex items-center">
                          <Code className="h-5 w-5 mr-2 text-blue-600" />
                          {category.category}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-2">
                          {category.topics.map((topic) => {
                            const id = `${category.category}-${topic}`
                            return (
                              <div key={topic} className="flex items-center space-x-2">
                                <Checkbox
                                  id={id}
                                  checked={checkedItems[id] || false}
                                  onCheckedChange={() => handleCheckboxChange(id)}
                                />
                                <label htmlFor={id} className="text-sm cursor-pointer">
                                  {topic}
                                </label>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Practice Questions */}
            <TabsContent value="questions" className="space-y-6">
              {commonQuestions.map((section) => (
                <Card key={section.category}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {section.category === "Technical" && <Code className="h-5 w-5 mr-2 text-blue-600" />}
                      {section.category === "Behavioral" && <Users className="h-5 w-5 mr-2 text-green-600" />}
                      {section.category === "Problem Solving" && <Lightbulb className="h-5 w-5 mr-2 text-purple-600" />}
                      {section.category} Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.questions.map((question, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm">{question}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Study Plan */}
            <TabsContent value="plan" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>4-Week Interview Preparation Plan</CardTitle>
                  <CardDescription>A structured approach to prepare for your technical interview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {studyPlan.map((week) => (
                      <div key={week.week} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center mb-2">
                          <Badge variant="outline" className="mr-2">
                            Week {week.week}
                          </Badge>
                          <h3 className="font-semibold">{week.focus}</h3>
                        </div>
                        <ul className="space-y-1">
                          {week.tasks.map((task, index) => (
                            <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Interview Tips */}
            <TabsContent value="tips" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                      Before the Interview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Research the company and role thoroughly</li>
                      <li>• Review your resume and be ready to discuss projects</li>
                      <li>• Practice coding problems on a whiteboard</li>
                      <li>• Prepare questions to ask the interviewer</li>
                      <li>• Get a good night's sleep</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2 text-green-600" />
                      During the Interview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Think out loud while solving problems</li>
                      <li>• Ask clarifying questions</li>
                      <li>• Start with a simple solution, then optimize</li>
                      <li>• Test your code with examples</li>
                      <li>• Stay calm and confident</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="h-5 w-5 mr-2 text-blue-600" />
                      Technical Best Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Write clean, readable code</li>
                      <li>• Consider edge cases and error handling</li>
                      <li>• Discuss time and space complexity</li>
                      <li>• Explain your design decisions</li>
                      <li>• Be open to feedback and suggestions</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-purple-600" />
                      Communication Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Be enthusiastic and show genuine interest</li>
                      <li>• Use the STAR method for behavioral questions</li>
                      <li>• Admit when you don't know something</li>
                      <li>• Show your problem-solving process</li>
                      <li>• Follow up with thoughtful questions</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Link href="/interview/setup">
              <Button size="lg">
                <Brain className="h-4 w-4 mr-2" />
                Take Practice Interview
              </Button>
            </Link>
            <Link href="/interview/history">
              <Button variant="outline" size="lg">
                <Clock className="h-4 w-4 mr-2" />
                View Progress
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
