import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const programSchema = new mongoose.Schema({
  title: { type: String, required: true },
  days: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true},
  gradient: { type: String, required: true },
}, { timestamps: true });

const Program = mongoose.model("Program", programSchema);
export default Program;
