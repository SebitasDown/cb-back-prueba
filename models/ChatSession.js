import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    index: true,
  },
  title: {
    type: String,
    default: "Nueva conversación",
  },
}, {
  timestamps: true,
});

chatSessionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("ChatSession", chatSessionSchema);
