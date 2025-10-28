import mongoose from "mongoose";

// Schema for a single SpO₂ reading
const spo2ReadingSchema = new mongoose.Schema({
  spo2Value: {
    type: Number,
    required: true,
    min: 50,    // SpO₂ value must be between 50 and 100%
    max: 100,
  },
  pulseRate: {
    type: Number,
    min: 30,    // Valid range for pulse rate (30-200 bpm)
    max: 200,
    required: false,  // Pulse rate is optional
  },
  measurementTime: {
    type: Date,
    required: true,  // Measurement time is required
  },
  notes: {
    type: String,
    default: "",  // Optional field for any additional notes
  },
});

// Main schema for SpO₂ readings associated with a specific user
const spo2Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming there's a "User" model to reference
      required: true,
    },
    readings: [spo2ReadingSchema], // Array to store multiple SpO₂ readings
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  }
);

// Creating the model for SpO₂ readings
const SpO2 = mongoose.model("SpO2", spo2Schema);

export default SpO2;
