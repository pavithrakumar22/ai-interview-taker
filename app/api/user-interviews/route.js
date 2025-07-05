import { connectToDB } from "../../../lib/db"
import InterviewResult from "../../../models/InterviewResult"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    // Get all interviews for this user with pagination
    const interviews = await InterviewResult.find({ userId: userId }).sort({ createdAt: -1 }).limit(50) // Limit to last 50 interviews

    const formattedInterviews = interviews.map((interview) => ({
      _id: interview._id.toString(),
      role: interview.role,
      techs: interview.techs,
      projects: interview.projects,
      experience: interview.experience,
      averageScore: interview.averageScore,
      totalQuestions: interview.interview?.length || 0,
      createdAt: interview.createdAt,
      summary: interview.summary,
    }))

    return Response.json({
      interviews: formattedInterviews,
      total: interviews.length,
    })
  } catch (error) {
    console.error("Error fetching user interviews:", error)
    return Response.json({ error: "Failed to fetch interviews" }, { status: 500 })
  }
}
