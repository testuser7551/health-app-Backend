import mongoose from "mongoose";

const BodyTemperatureReadingSchema = new mongoose.Schema(
  {
    temperature: {
      type: Number,
      required: true,
      min: 86,
      max: 113,
    },
    unit: {
      type: String,
      enum: ["°C", "°F"],
      default: "°F",
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

const BodyTemperatureSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readings: [BodyTemperatureReadingSchema],
  },
  { timestamps: true }
);

export default mongoose.model("BodyTemperature", BodyTemperatureSchema);
