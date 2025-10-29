import mongoose from "mongoose";

const FullBodyCheckupReadingSchema = new mongoose.Schema(
  {
    lastCheckupDate: {
      type: String, // Stored as "DD/MM/YYYY" from frontend
      required: true,
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

const FullBodyCheckupSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readings: [FullBodyCheckupReadingSchema],
  },
  { timestamps: true }
);

export default mongoose.model("FullBodyCheckup", FullBodyCheckupSchema);
