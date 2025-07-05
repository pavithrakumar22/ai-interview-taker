import mongoose from "mongoose"

// Clear the model cache to ensure we get the updated schema
if (mongoose.models.InterviewResult) {
  delete mongoose.models.InterviewResult
}

const InterviewResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  techs: [
    {
      type: String,
      required: true,
    },
  ],
  projects: [
    {
      type: String,
      default: [],
    },
  ],
  experience: {
    type: String, // Explicitly String to handle "1-3", "3-5", etc.
    required: true,
  },
  averageScore: {
    type: String,
    required: true,
  },
  summary: {
    strengths: {
      type: String,
      default: "",
    },
    weaknesses: {
      type: String,
      default: "",
    },
  },
  interview: [
    {
      question: {
        type: String,
        default: "",
      },
      userAnswer: {
        type: String,
        default: "",
      },
      score: {
        type: String,
        default: "0",
      },
      feedback: {
        type: String,
        default: "",
      },
      idealAnswer: {
        type: String,
        default: "",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create the model fresh
const InterviewResult = mongoose.model("InterviewResult", InterviewResultSchema)

export default InterviewResult
