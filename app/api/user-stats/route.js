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

    // Get all interviews for this specific user
    const interviews = await InterviewResult.find({ userId: userId }).sort({ createdAt: -1 })

    const totalInterviews = interviews.length
    const totalScore = interviews.reduce((sum, interview) => sum + Number.parseFloat(interview.averageScore || 0), 0)
    const averageScore = totalInterviews > 0 ? (totalScore / totalInterviews).toFixed(1) : "0"

    // Get unique domains practiced
    const uniqueDomains = [...new Set(interviews.map((interview) => interview.role))]
    const domainsPracticed = uniqueDomains.length

    // Calculate total practice time (estimate 2 minutes per question)
    const totalQuestions = interviews.reduce((sum, interview) => sum + (interview.interview?.length || 0), 0)
    const practiceTimeMinutes = totalQuestions * 2
    const practiceTimeHours = Math.floor(practiceTimeMinutes / 60)
    const remainingMinutes = practiceTimeMinutes % 60
    const practiceTime =
      practiceTimeHours > 0 ? `${practiceTimeHours}h ${remainingMinutes}m` : `${practiceTimeMinutes}m`

    // Get recent interviews for history
    const recentInterviews = interviews.slice(0, 10).map((interview) => ({
      _id: interview._id.toString(),
      role: interview.role,
      techs: interview.techs,
      averageScore: interview.averageScore,
      totalQuestions: interview.interview?.length || 0,
      createdAt: interview.createdAt,
    }))

    return Response.json({
      totalInterviews,
      averageScore,
      domainsPracticed,
      practiceTime,
      recentInterviews,
      uniqueDomains,
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
