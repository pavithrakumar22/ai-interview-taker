// app/api/answer/route.js
import { runGemini } from '../../lib/gemini'; // adjust the path if needed
import { buildPrompt } from '../../lib/promptBuilder';


export async function POST(req) {
  try {
    const body = await req.json();
    const { role, techs, question, userAnswer } = body;

    const prompt = buildPrompt({ role, techs, question, userAnswer });
    const output = await runGemini(prompt);

    console.log("🧠 Gemini Output:\n", output);

    // CASE 1: First question only
    if (!question || !userAnswer) {
      const match = output.match(/Question:\s*(.+)/i);
      return Response.json({
        question: match?.[1]?.trim() || "Sorry, something went wrong.",
      });
    }

    // CASE 2: Evaluation + next question
    const parseField = (label) => {
      const match = output.match(new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z][a-z]+:|$)`, 'i'));
      return match ? match[1].trim() : null;
    };

    return Response.json({
      score: parseField("Score"),
      idealAnswer: parseField("Ideal Answer"),
      feedback: parseField("Feedback"),
      nextQuestion: parseField("Next Question")
    });
  } catch (err) {
    console.error("❌ API Error:", err);
    return new Response("Server error", { status: 500 });
  }
}
