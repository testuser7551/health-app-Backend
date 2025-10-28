import mongoose from "mongoose";

// Step Count Reading Schema
const stepCountReadingSchema = new mongoose.Schema({
  stepCount: {
    type: Number,
    required: true,
    min: 0, // Step count cannot be negative
  },
  measurementTime: {
    type: Date,
    default: Date.now, // Defaults to the current date and time
  },
  notes: {
    type: String,
    default: "",
  },
});

// Main Schema for Storing Step Counts for Each User
const stepCountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model to reference
      required: true, // Each step count entry needs to be associated with a user
    },
    readings: [stepCountReadingSchema], // Array to store multiple step count readings for each user
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the StepCount model
const StepCount = mongoose.model("StepCount", stepCountSchema);
export default StepCount;
