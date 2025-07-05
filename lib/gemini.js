import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client using your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create a wrapper function to generate a response from Gemini
export async function runGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();  // return plain text
}
