import mongoose from "mongoose";

// Schema for a single respiratory rate reading
const respiratoryRateReadingSchema = new mongoose.Schema({
  respiratoryRate: {
    type: Number,
    required: true,
    min: 5,    // Valid range is 5-60 br/min
    max: 60,
  },
  measurementTime: {
    type: Date,
    default: Date.now,  // Default to current time if not provided
  },
  notes: {
    type: String,
    default: "",  // Optional field for any additional information
  },
});

// Main schema for respiratory rate readings associated with a specific user
const respiratoryRateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming there's a "User" model to reference
      required: true,
    },
    readings: [respiratoryRateReadingSchema],  // Array to store multiple readings
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  }
);

// Creating the model for respiratory rate readings
const RespiratoryRate = mongoose.model("RespiratoryRate", respiratoryRateSchema);

export default RespiratoryRate;
