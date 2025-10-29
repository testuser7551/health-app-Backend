import mongoose from "mongoose";

const VaccineReadingSchema = new mongoose.Schema(
  {
    vaccineStatus: {
      type: String,
      enum: ["Up to date", "Need update"],
      required: true,
    },
    lastCheckDate: {
      type: String, // Stored as formatted string (e.g. "27/10/2025")
      trim: true,
    },
    measurementTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const VaccineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readings: [VaccineReadingSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Vaccine", VaccineSchema);
