import { connectToDB } from "../../../lib/db"
import InterviewResult from "../../../models/InterviewResult"
import { auth } from "@clerk/nextjs/server"

export async function POST(req) {
  try {
    // Get the authenticated user
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: "Unauthorized - Please sign in" }, { status: 401 })
    }

    await connectToDB()
    console.log("✅ Connected to MongoDB")

    const body = await req.json()
    console.log("📝 Received data:", JSON.stringify(body, null, 2))

    const { role, techs, projects, experience, interview } = body

    if (!interview || !Array.isArray(interview) || interview.length === 0) {
      console.log("❌ No interview data provided")
      return Response.json({ error: "No interview data provided." }, { status: 400 })
    }

    // Validate and clean the data
    const cleanedData = {
      userId: String(userId), // Ensure it's a string
      role: String(role || "Unknown"),
      techs: Array.isArray(techs) ? techs.map((t) => String(t)) : [],
      projects: Array.isArray(projects) ? projects.map((p) => String(p)) : [],
      experience: String(experience || "0-1"), // Explicitly convert to string
    }

    console.log("🧹 Cleaned data:", cleanedData)

    // Process interview data
    const scored = interview.map((item) => ({
      question: String(item.question || ""),
      userAnswer: String(item.userAnswer || ""),
      score: String(item.score || "0"),
      feedback: String(item.feedback || "Good answer"),
      idealAnswer: String(item.idealAnswer || "Sample ideal answer"),
    }))

    const totalScore = scored.reduce((sum, item) => sum + (Number.parseInt(item.score) || 0), 0)
    const averageScore = scored.length > 0 ? (totalScore / scored.length).toFixed(2) : "0"

    console.log("📊 Calculated average score:", averageScore)

    const strengths = []
    const weaknesses = []

    scored.forEach(({ score, feedback }) => {
      const scoreNum = Number.parseInt(score) || 0
      const lower = feedback.toLowerCase()
      if (scoreNum >= 7 || lower.includes("correct") || lower.includes("good")) {
        strengths.push(feedback)
      }
      if (scoreNum < 7 || lower.includes("improve") || lower.includes("lacking") || lower.includes("missed")) {
        weaknesses.push(feedback)
      }
    })

    // Create the document with explicit field mapping
    const interviewDoc = {
      userId: cleanedData.userId,
      role: cleanedData.role,
      techs: cleanedData.techs,
      projects: cleanedData.projects,
      experience: cleanedData.experience, // This should now be a string
      averageScore: String(averageScore),
      summary: {
        strengths:
          strengths.length > 0
            ? `Strong understanding in ${cleanedData.techs.join(", ")}. Key areas of strength identified.`
            : "Consistent performance across all areas.",
        weaknesses:
          weaknesses.length > 0
            ? `Areas for improvement identified. Focus on these topics for better performance.`
            : "No major weaknesses identified.",
      },
      interview: scored,
      createdAt: new Date(),
    }

    console.log("💾 Final document to save:", JSON.stringify(interviewDoc, null, 2))

    // Create the document
    const saved = await InterviewResult.create(interviewDoc)
    console.log("✅ Interview result saved with ID:", saved._id)

    return Response.json({
      _id: saved._id.toString(),
      role: saved.role,
      techs: saved.techs,
      projects: saved.projects,
      experience: saved.experience,
      totalQuestions: saved.interview.length,
      averageScore: saved.averageScore,
      summary: saved.summary,
      fullInterview: saved.interview,
    })
  } catch (error) {
    console.error("❌ Error saving to MongoDB:", error)
    console.error("Error name:", error.name)
    console.error("Error message:", error.message)
    if (error.errors) {
      console.error("Validation errors:", error.errors)
    }
    return Response.json(
      {
        error: "Failed to process result",
        details: error.message,
        validationErrors: error.errors || null,
      },
      { status: 500 },
    )
  }
}
