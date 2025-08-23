import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["Yoga", "Meditation"], default: "Yoga" },
    date: { type: String, default: "" },
    duration: { type: Number, default: 30 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true }
);

export default mongoose.model("Session", SessionSchema);