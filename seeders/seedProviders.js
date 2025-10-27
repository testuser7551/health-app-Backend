// seeders/seedProviders.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import HealthcareProvider from "../models/careTeam/HealthcareProvider.js";

dotenv.config();

const providers = [
  {
    name: "Dr. Emily Johnson",
    specialty: "Cardiology",
    state: "CA",
    city: "Los Angeles",
    npi_number: "1234567890",
    phone: "(310) 555-0148",
    address: "1234 Sunset Blvd, Los Angeles, CA 90026",
    organization: "HeartCare Medical Group",
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Pediatrics",
    state: "NY",
    city: "New York",
    npi_number: "2345678901",
    phone: "(212) 555-0183",
    address: "88 Madison Ave, New York, NY 10016",
    organization: "BrightKids Pediatrics",
  },
  {
    name: "Dr. Sophia Patel",
    specialty: "Dermatology",
    state: "TX",
    city: "Houston",
    npi_number: "3456789012",
    phone: "(713) 555-0274",
    address: "4321 Kirby Dr, Houston, TX 77098",
    organization: "ClearSkin Clinic",
  },
  {
    name: "Dr. Robert Garcia",
    specialty: "Orthopedics",
    state: "FL",
    city: "Miami",
    npi_number: "4567890123",
    phone: "(305) 555-0325",
    address: "500 Brickell Ave, Miami, FL 33131",
    organization: "Motion Orthopedic Center",
  },
];

const seedProviders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await HealthcareProvider.deleteMany({});
    await HealthcareProvider.insertMany(providers);
    console.log("✅ Healthcare providers seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
};

seedProviders();
