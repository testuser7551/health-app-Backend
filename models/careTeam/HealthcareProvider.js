// models/HealthcareProvider.js
import mongoose from "mongoose";

const HealthcareProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: false },
  npi_number: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  organization: { type: String },
});

export default mongoose.model("HealthcareProvider", HealthcareProviderSchema);
