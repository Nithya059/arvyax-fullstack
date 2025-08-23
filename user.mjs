// backend/models/user.mjs
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models?.User || mongoose.model("User", userSchema);