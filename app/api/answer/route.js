import { runGemini } from "../../../lib/gemini"
import { buildPrompt } from "../../../lib/promptBuilder"

export async function POST(req) {
  try {
    const body = await req.json()
    const {
      role,
      techs,
      question,
      userAnswer,
      currentPhase = "technologies",
      currentTechIndex = 0,
      questionCount = 0,
      projects = [],
    } = body

    const prompt = buildPrompt({
      role,
      techs,
      question,
      userAnswer,
      currentPhase,
      currentTechIndex,
      projects,
    })

    const output = await runGemini(prompt)
    console.log("🧠 Gemini Output:\n", output)

    // CASE 1: First question only
    if (!question || !userAnswer) {
      const match = output.match(/Question:\s*(.+)/i)
      return Response.json({
        question: match?.[1]?.trim() || "Sorry, something went wrong.",
        currentPhase: "technologies",
        currentTechIndex: 0,
        questionCount: 1,
      })
    }

    // CASE 2: Evaluation + next question
    const parseField = (label) => {
      const match = output.match(new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z][a-z]+:|$)`, "i"))
      return match ? match[1].trim() : null
    }

    const score = parseField("Score")
    const idealAnswer = parseField("Ideal Answer")
    const feedback = parseField("Feedback")
    let nextQuestion = parseField("Next Question")

    // Determine next phase and question logic
    let newPhase = currentPhase
    let newTechIndex = currentTechIndex
    const newQuestionCount = questionCount + 1

    // Technology phase logic: 3 questions per technology
    if (currentPhase === "technologies") {
      const questionsPerTech = 3
      const totalTechQuestions = questionsPerTech * techs.length

      if (newQuestionCount >= totalTechQuestions) {
        // Move to projects phase
        newPhase = "projects"
        nextQuestion =
          "Can you tell me about a significant project you've worked on? Please describe the technologies used, your role, and any challenges you faced."
      } else if (newQuestionCount % questionsPerTech === 0) {
        // Move to next technology
        newTechIndex = Math.floor(newQuestionCount / questionsPerTech)
        if (newTechIndex < techs.length) {
          nextQuestion = `Now let's focus on ${techs[newTechIndex]}. ${nextQuestion}`
        }
      }
    }

    // Projects phase logic: 2-3 questions about projects
    if (currentPhase === "projects" && newQuestionCount >= techs.length * 3 + 3) {
      nextQuestion = null // End interview
    }

    return Response.json({
      score,
      idealAnswer,
      feedback,
      nextQuestion,
      currentPhase: newPhase,
      currentTechIndex: newTechIndex,
      questionCount: newQuestionCount,
    })
  } catch (err) {
    console.error("❌ API Error:", err)
    return new Response("Server error", { status: 500 })
  }
}
