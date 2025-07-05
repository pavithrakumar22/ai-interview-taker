import { connectToDB } from "../../../lib/db"
import InterviewResult from "../../../models/InterviewResult"
import { auth } from "@clerk/nextjs/server"

export async function GET(req) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return Response.json({ error: "Interview ID is required" }, { status: 400 })
    }

    await connectToDB()

    // Find the interview result by ID and ensure it belongs to the current user
    const result = await InterviewResult.findOne({ _id: id, userId: userId })

    if (!result) {
      return Response.json({ error: "Interview result not found or access denied" }, { status: 404 })
    }

    return Response.json({
      _id: result._id.toString(),
      role: result.role,
      techs: result.techs,
      projects: result.projects,
      experience: result.experience,
      averageScore: result.averageScore,
      totalQuestions: result.interview.length,
      summary: result.summary,
      fullInterview: result.interview,
      createdAt: result.createdAt,
    })
  } catch (error) {
    console.error("Error fetching interview result:", error)
    return Response.json({ error: "Failed to fetch result", details: error.message }, { status: 500 })
  }
}
