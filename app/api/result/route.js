// app/api/result/route.js
import { connectToDB } from "../../lib/db.js";
import InterviewResult from "../../models/InterviewResult.js";

export async function POST(req) {
  try {
    const body = await req.json();
    const { role, techs, projects, experience, interview } = body;

    if (!interview || !Array.isArray(interview) || interview.length === 0) {
      return Response.json({ error: "No interview data provided." }, { status: 400 });
    }

    // Convert and filter valid scores
    const scored = interview
      .map((item) => ({
        ...item,
        score: parseInt(item.score),
      }))
      .filter((item) => !isNaN(item.score));

    const totalScore = scored.reduce((sum, item) => sum + item.score, 0);
    const averageScore = (totalScore / scored.length).toFixed(2);

    const strengths = [];
    const weaknesses = [];

    scored.forEach(({ score, feedback }) => {
      const lower = feedback.toLowerCase();

      if (score >= 7 || lower.includes("correct") || lower.includes("good")) {
        strengths.push(feedback);
      }

      if (score < 7 || lower.includes("improve") || lower.includes("lacking") || lower.includes("missed")) {
        weaknesses.push(feedback);
      }
    });

    // Summarized patterns
    const summarizedStrengths = strengths.length
      ? `The candidate demonstrates solid understanding of fundamental concepts in ${techs.join(', ')}. Answers showed clarity and confidence, especially in areas like: ${getTopTopics(strengths)}.`
      : "No strong strengths were consistently demonstrated.";

    const summarizedWeaknesses = weaknesses.length
      ? `The candidate struggled in some areas like: ${getTopTopics(weaknesses)}. Future focus should be on filling these gaps.`
      : "No major weaknesses were observed — answers were consistently strong.";

      // ✅ Save to MongoDB
    await connectToDB();
    const saved = await InterviewResult.create({
      role,
      techs,
      projects,
      experience,
      averageScore,
      summary: {
        strengths: summarizedStrengths,
        weaknesses: summarizedWeaknesses,
      },
      interview,
    });

    return Response.json({
      role,
      techs,
      projects,
      experience,
      totalQuestions: interview.length,
      averageScore,
      summary: {
        strengths: summarizedStrengths,
        weaknesses: summarizedWeaknesses,
      },
      fullInterview: interview,
    });
  } catch (error) {
    return Response.json({ error: "Failed to process result", details: error.message }, { status: 500 });
  }
}

// Extract common topics mentioned across feedbacks
function getTopTopics(feedbacks) {
  const keywordCounts = {};
  const keywords = ["hooks", "state", "props", "flex", "lifecycle", "composition", "effect", "jsx", "rendering", "tailwind", "class", "api", "custom hooks", "structure"];

  feedbacks.forEach((text) => {
    keywords.forEach((word) => {
      if (text.toLowerCase().includes(word)) {
        keywordCounts[word] = (keywordCounts[word] || 0) + 1;
      }
    });
  });

  const sorted = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);

  return sorted.slice(0, 3).join(', ') || "various areas";
}
