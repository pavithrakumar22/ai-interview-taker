import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ai-interview"

async function testConnection() {
  try {
    // Clear all models
    Object.keys(mongoose.models).forEach((key) => {
      delete mongoose.models[key]
    })

    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected to MongoDB successfully")

    // Test creating a simple document
    const TestSchema = new mongoose.Schema({
      experience: String,
      test: String,
    })

    const TestModel = mongoose.model("Test", TestSchema)

    const testDoc = await TestModel.create({
      experience: "1-3",
      test: "This is a test",
    })

    console.log("✅ Test document created:", testDoc)

    await TestModel.deleteOne({ _id: testDoc._id })
    console.log("✅ Test document deleted")

    await mongoose.disconnect()
    console.log("✅ Disconnected from MongoDB")
  } catch (error) {
    console.error("❌ Database test failed:", error)
  }
}

testConnection()
