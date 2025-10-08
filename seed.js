import mongoose from "mongoose";
import dotenv from "dotenv";
import Program from "./models/Program.js";

// Load .env
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Pure data version (no icons)
const wellnessData = [
  {
    title: "Sleep",
    days: 100,
    description: "Improve your sleep quality with guided bedtime routines.",
    icon: "<Moon className='w-8 h-8 text-white' />",
    gradient: "bg-gradient-to-r from-blue-900 to-blue-300",
  },
  {
    title: "Food",
    days: 100,
    description: "Personalized nutrition tips and healthy meal plans.",
    icon: "<Utensils className='w-8 h-8 text-green-500' />",
    gradient: "bg-gradient-to-r from-green-100 via-green-200 to-green-300",
  },
  {
    title: "Stress",
    days: 100,
    description: "Calm your mind with stress management techniques.",
    icon: "<Brain className='w-8 h-8 text-purple-500' />",
    gradient: "bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300",
  },
  {
    title: "Menopause",
    days: 180,
    description: "Stay active with easy-to-follow workout programs.",
    icon: "<Dumbbell className='w-8 h-8 text-red-500' />",
    gradient: "bg-gradient-to-r from-red-100 via-red-200 to-red-300",
  },
  {
    title: "Cardiometabolic",
    days: 100,
    description: "Boost your mood through positive psychology practices.",
    icon: "<Smile className='w-8 h-8 text-yellow-500' />",
    gradient: "bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300",
  },
  {
    title: "Resilience & Mood",
    days: 100,
    description: "Keep your heart strong with daily wellness goals.",
    icon: "<Heart className='w-8 h-8 text-pink-500' />",
    gradient: "bg-gradient-to-r from-pink-100 via-pink-200 to-pink-300",
  },
  {
    title: "Substance Use",
    days: 100,
    description: "Support and resources to manage substance use effectively.",
    icon: "<BatteryCharging className='w-8 h-8 text-indigo-500' />",
    gradient: "bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-300",
  },
  {
    title: "Pain & Inflammation",
    days: 100,
    description: "Guidance on managing chronic pain and inflammation.",
    icon: "<Activity className='w-8 h-8 text-red-400' />",
    gradient: "bg-gradient-to-r from-red-200 via-red-300 to-red-400",
  },
  {
    title: "Sexual Wellness",
    days: 100,
    description: "Promote healthy sexual function and intimacy.",
    icon: "<Heart className='w-8 h-8 text-pink-600' />",
    gradient: "bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400",
  },
  {
    title: "Spiritual Health",
    days: 100,
    description: "Practices to strengthen your spiritual well-being.",
    icon: "<BookOpen className='w-8 h-8 text-purple-400' />",
    gradient: "bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400",
  },
  {
    title: "Cognitive Health",
    days: 100,
    description: "Activities and strategies to boost brain function.",
    icon: "<Brain className='w-8 h-8 text-blue-400' />",
    gradient: "bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400",
  },
  {
    title: "Environmental Health",
    days: 100,
    description: "Improve wellness by optimizing your surroundings.",
    icon: "<Globe className='w-8 h-8 text-green-600' />",
    gradient: "bg-gradient-to-r from-green-200 via-green-300 to-green-400",
  },
  {
    title: "Motivation & Readiness",
    days: 100,
    description: "Tools to enhance motivation and prepare for lifestyle change.",
    icon: "<Target className='w-8 h-8 text-orange-500' />",
    gradient: "bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400",
  },
  {
    title: "Blood Pressure",
    days: 100,
    description: "Monitor and improve your blood pressure for heart health.",
    icon: "<Thermometer className='w-8 h-8 text-red-600' />",
    gradient: "bg-gradient-to-r from-red-300 via-red-400 to-red-500",
  }
];


async function seedWellness() {
  try {
    await Program.deleteMany(); // clear old data
    await Program.insertMany(wellnessData);
    console.log("Program Wellness data seeded successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding Program wellness data:", error);
    mongoose.connection.close();
  }
}

seedWellness();
