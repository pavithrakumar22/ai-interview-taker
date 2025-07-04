import mongoose from "mongoose";

const InterviewResultSchema = new mongoose.Schema(
  {
    role: String,
    techs: [String],
    projects: [String],
    experience: Number,
    averageScore: String,
    summary: {
      strengths: String,
      weaknesses: String,
    },
    interview: [
      {
        question: String,
        userAnswer: String,
        score: String,
        idealAnswer: String,
        feedback: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.InterviewResult ||
  mongoose.model("InterviewResult", InterviewResultSchema);
