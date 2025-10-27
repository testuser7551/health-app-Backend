import mongoose from "mongoose";

const BloodPressureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  readings: [
    {
      quickEntry: {
        type: String, // e.g., "118/76"
        trim: true
      },
      systolic: {
        type: Number,
        required: true
      },
      diastolic: {
        type: Number,
        required: true
      },
      pulse: {
        type: Number
      },
      arm: {
        type: String,
        enum: ["Left", "Right"],
        default: "Left"
      },
      position: {
        type: String,
        enum: ["Sitting", "Standing", "Lying"],
        default: "Sitting"
      },
      measurementTime: {
        type: Date,
        default: Date.now
      },
      notes: {
        type: String,
        trim: true
      }
    }
  ]
}, { timestamps: true });

export default mongoose.model("BloodPressure", BloodPressureSchema);
