import mongoose from "mongoose";

const pulseRateReadingSchema = new mongoose.Schema({
  pulseRate: {
    type: Number,
    required: true,
    min: 30,
    max: 200,
  },
  measurementTime: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: "",
  },
});

const pulseRateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readings: [pulseRateReadingSchema],
  },
  {
    timestamps: true,
  }
);

const PulseRate = mongoose.model("PulseRate", pulseRateSchema);
export default PulseRate;
