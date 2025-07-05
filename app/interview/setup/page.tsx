"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

const domains = [
  { value: "frontend", label: "Frontend Development" },
  { value: "backend", label: "Backend Development" },
  { value: "fullstack", label: "Full Stack Development" },
  { value: "mobile", label: "Mobile Development" },
  { value: "devops", label: "DevOps & Cloud" },
  { value: "data", label: "Data Science & Analytics" },
  { value: "ai", label: "AI & Machine Learning" },
  { value: "blockchain", label: "Blockchain Development" },
  { value: "game", label: "Game Development" },
  { value: "embedded", label: "Embedded Systems" },
]

const technologies = [
  // Frontend
  { value: "react", label: "React", category: "Frontend" },
  { value: "nextjs", label: "Next.js", category: "Frontend" },
  { value: "vue", label: "Vue.js", category: "Frontend" },
  { value: "angular", label: "Angular", category: "Frontend" },
  { value: "svelte", label: "Svelte", category: "Frontend" },
  { value: "typescript", label: "TypeScript", category: "Frontend" },
  { value: "javascript", label: "JavaScript", category: "Frontend" },
  { value: "html", label: "HTML", category: "Frontend" },
  { value: "css", label: "CSS", category: "Frontend" },
  { value: "tailwind", label: "Tailwind CSS", category: "Frontend" },
  { value: "sass", label: "Sass/SCSS", category: "Frontend" },
  { value: "webpack", label: "Webpack", category: "Frontend" },
  { value: "vite", label: "Vite", category: "Frontend" },

  // Backend
  { value: "nodejs", label: "Node.js", category: "Backend" },
  { value: "express", label: "Express.js", category: "Backend" },
  { value: "nestjs", label: "NestJS", category: "Backend" },
  { value: "python", label: "Python", category: "Backend" },
  { value: "django", label: "Django", category: "Backend" },
  { value: "flask", label: "Flask", category: "Backend" },
  { value: "fastapi", label: "FastAPI", category: "Backend" },
  { value: "java", label: "Java", category: "Backend" },
  { value: "spring", label: "Spring Boot", category: "Backend" },
  { value: "csharp", label: "C#", category: "Backend" },
  { value: "dotnet", label: ".NET", category: "Backend" },
  { value: "php", label: "PHP", category: "Backend" },
  { value: "laravel", label: "Laravel", category: "Backend" },
  { value: "ruby", label: "Ruby", category: "Backend" },
  { value: "rails", label: "Ruby on Rails", category: "Backend" },
  { value: "go", label: "Go", category: "Backend" },
  { value: "rust", label: "Rust", category: "Backend" },
  { value: "kotlin", label: "Kotlin", category: "Backend" },

  // Mobile
  { value: "react-native", label: "React Native", category: "Mobile" },
  { value: "flutter", label: "Flutter", category: "Mobile" },
  { value: "swift", label: "Swift", category: "Mobile" },
  { value: "kotlin-mobile", label: "Kotlin (Android)", category: "Mobile" },
  { value: "xamarin", label: "Xamarin", category: "Mobile" },
  { value: "ionic", label: "Ionic", category: "Mobile" },

  // Database
  { value: "mongodb", label: "MongoDB", category: "Database" },
  { value: "postgresql", label: "PostgreSQL", category: "Database" },
  { value: "mysql", label: "MySQL", category: "Database" },
  { value: "redis", label: "Redis", category: "Database" },
  { value: "elasticsearch", label: "Elasticsearch", category: "Database" },
  { value: "firebase", label: "Firebase", category: "Database" },
  { value: "supabase", label: "Supabase", category: "Database" },

  // DevOps & Cloud
  { value: "docker", label: "Docker", category: "DevOps" },
  { value: "kubernetes", label: "Kubernetes", category: "DevOps" },
  { value: "aws", label: "AWS", category: "DevOps" },
  { value: "azure", label: "Azure", category: "DevOps" },
  { value: "gcp", label: "Google Cloud", category: "DevOps" },
  { value: "terraform", label: "Terraform", category: "DevOps" },
  { value: "jenkins", label: "Jenkins", category: "DevOps" },
  { value: "github-actions", label: "GitHub Actions", category: "DevOps" },
  { value: "nginx", label: "Nginx", category: "DevOps" },

  // Data Science & AI
  { value: "pandas", label: "Pandas", category: "Data Science" },
  { value: "numpy", label: "NumPy", category: "Data Science" },
  { value: "scikit-learn", label: "Scikit-learn", category: "Data Science" },
  { value: "tensorflow", label: "TensorFlow", category: "AI/ML" },
  { value: "pytorch", label: "PyTorch", category: "AI/ML" },
  { value: "streamlit", label: "Streamlit", category: "Data Science" },
  { value: "jupyter", label: "Jupyter", category: "Data Science" },
  { value: "r", label: "R", category: "Data Science" },

  // Other
  { value: "graphql", label: "GraphQL", category: "API" },
  { value: "rest", label: "REST APIs", category: "API" },
  { value: "websockets", label: "WebSockets", category: "API" },
  { value: "git", label: "Git", category: "Tools" },
  { value: "linux", label: "Linux", category: "Tools" },
]

const experienceLevels = [
  { value: "0-1", label: "0-1 years (Entry Level)" },
  { value: "1-3", label: "1-3 years (Junior)" },
  { value: "3-5", label: "3-5 years (Mid Level)" },
  { value: "5-8", label: "5-8 years (Senior)" },
  { value: "8+", label: "8+ years (Lead/Principal)" },
]

export default function InterviewSetup() {
  const [selectedDomain, setSelectedDomain] = useState("")
  const [selectedExperience, setSelectedExperience] = useState("")
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])
  const router = useRouter()

  const handleStartInterview = () => {
    if (selectedDomain && selectedExperience && selectedTechnologies.length >= 1) {
      const selectedTechLabels = selectedTechnologies.map(
        (techValue) => technologies.find((t) => t.value === techValue)?.label || techValue,
      )
      const params = new URLSearchParams({
        domain: selectedDomain,
        experience: selectedExperience,
        techs: selectedTechLabels.join(","),
      })
      router.push(`/interview/chat?${params.toString()}`)
    }
  }

  // const selectedDomainData = domains.find((d) => d.value === selectedDomain)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/home">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Interview Setup</CardTitle>
              <CardDescription>Configure your interview preferences to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Domain Selection */}
              <div className="space-y-2">
                <Label htmlFor="domain">Select Interview Domain</Label>
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map((domain) => (
                      <SelectItem key={domain.value} value={domain.value}>
                        {domain.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Technology Selection */}
              {selectedDomain && (
                <div className="space-y-2">
                  <Label>Select Technologies (Choose 1-5 technologies you want to be interviewed on)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-4 border rounded-lg">
                    {technologies
                      .filter((tech) => {
                        // Show relevant technologies based on domain
                        if (selectedDomain === "frontend") return ["Frontend", "Tools", "API"].includes(tech.category)
                        if (selectedDomain === "backend")
                          return ["Backend", "Database", "Tools", "API"].includes(tech.category)
                        if (selectedDomain === "fullstack")
                          return ["Frontend", "Backend", "Database", "Tools", "API"].includes(tech.category)
                        if (selectedDomain === "mobile") return ["Mobile", "Tools", "API"].includes(tech.category)
                        if (selectedDomain === "devops") return ["DevOps", "Tools"].includes(tech.category)
                        if (selectedDomain === "data") return ["Data Science", "AI/ML", "Tools"].includes(tech.category)
                        if (selectedDomain === "ai") return ["AI/ML", "Data Science", "Tools"].includes(tech.category)
                        return true // Show all for other domains
                      })
                      .map((tech) => (
                        <div key={tech.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={tech.value}
                            checked={selectedTechnologies.includes(tech.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                if (selectedTechnologies.length < 5) {
                                  setSelectedTechnologies([...selectedTechnologies, tech.value])
                                }
                              } else {
                                setSelectedTechnologies(selectedTechnologies.filter((t) => t !== tech.value))
                              }
                            }}
                            className="rounded"
                            disabled={!selectedTechnologies.includes(tech.value) && selectedTechnologies.length >= 5}
                          />
                          <label htmlFor={tech.value} className="text-sm cursor-pointer">
                            {tech.label}
                          </label>
                        </div>
                      ))}
                  </div>
                  {selectedTechnologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedTechnologies.map((techValue) => {
                        const tech = technologies.find((t) => t.value === techValue)
                        return (
                          <span
                            key={techValue}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded flex items-center"
                          >
                            {tech?.label}
                            <button
                              onClick={() =>
                                setSelectedTechnologies(selectedTechnologies.filter((t) => t !== techValue))
                              }
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        )
                      })}
                    </div>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Selected: {selectedTechnologies.length}/5 technologies
                  </p>
                </div>
              )}

              {/* Experience Level */}
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Interview Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">What to expect:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• 5-10 technical questions based on your domain</li>
                  <li>• Real-time AI feedback on your answers</li>
                  <li>• Detailed performance analysis</li>
                  <li>• Downloadable PDF report at the end</li>
                </ul>
              </div>

              {/* Start Button */}
              <Button
                onClick={handleStartInterview}
                disabled={!selectedDomain || !selectedExperience || selectedTechnologies.length === 0}
                className="w-full"
                size="lg"
              >
                Start Interview
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
