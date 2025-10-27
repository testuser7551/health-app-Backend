import mongoose from "mongoose";

const LdlReadingSchema = new mongoose.Schema(
  {
    ldlValue: {
      type: Number,
      required: true,
      min: 30,
      max: 400,
    },
    fastingStatus: {
      type: String,
      enum: ["Fasting", "Not Fasting"],
      default: "Fasting",
    },
    measurementTime: {
      type: String, // Storing as string for flexible display (e.g. "27/10/2025, 11:24")
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const LdlCholesterolSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    readings: {
      type: [LdlReadingSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const LdlCholesterol = mongoose.model("LdlCholesterol", LdlCholesterolSchema);

export default LdlCholesterol;
