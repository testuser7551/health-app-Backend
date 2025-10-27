// models/careTeam/Caregiver.js
import mongoose from "mongoose";

const caregiverSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // The user who added this caregiver
    },
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

const Caregiver = mongoose.model("Caregiver", caregiverSchema);
export default Caregiver;
