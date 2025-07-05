export function buildPrompt({ role, techs, question, userAnswer, currentPhase, currentTechIndex, projects }) {
  const systemInstruction = `You are a strict and professional AI technical interviewer for the role of ${role}.
The candidate is comfortable with the following technologies: ${techs.join(", ")}.
Always stay relevant to the selected role and mentioned technologies.

🛑 Strict Output Format Rules:
- Do NOT use markdown, quotation marks, bullet points, or section titles
- Do NOT combine fields
- Do NOT put "Next Question" inside the feedback
- Output your response using *exactly* the four fields below:

Score: <just a number from 1 to 10>
Ideal Answer: <the best possible answer to the question>
Feedback: <only the feedback about the user's answer>
Next Question: <the next technical question to ask>
  `.trim()

  // CASE 1: First Question
  if (!question || !userAnswer) {
    return `${systemInstruction}

Begin the interview by asking a technical question about ${techs[0]}.
Focus on fundamental concepts and practical knowledge.

Respond using only this format:
Question: <your question about ${techs[0]}>
    `.trim()
  }

  // CASE 2: Technology Questions Phase
  if (currentPhase === "technologies") {
    const currentTech = techs[currentTechIndex] || techs[0]
    return `${systemInstruction}

Current Technology Focus: ${currentTech}
Question: ${question}
User Answer: ${userAnswer}

Evaluate the answer and ask the next question about ${currentTech}.
If this is the 3rd question for ${currentTech}, move to the next technology or ask about projects.
    `.trim()
  }

  // CASE 3: Project Questions Phase
  if (currentPhase === "projects") {
    return `${systemInstruction}

The candidate mentioned these projects: ${projects.join(", ")}
Question: ${question}
User Answer: ${userAnswer}

Focus on technical implementation details, design choices, and challenges faced in their projects.
Ask about architecture, technologies used, and problem-solving approaches.
    `.trim()
  }

  // Default case
  return `${systemInstruction}

Question: ${question}
User Answer: ${userAnswer}
  `.trim()
}
