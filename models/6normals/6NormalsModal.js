import mongoose from "mongoose";

const readingOptions = { timestamps: true, _id: false };

/* --------------------- 🩸 BLOOD PRESSURE --------------------- */
const BloodPressureSchema = new mongoose.Schema({
  systolic: {
    type: Number,
    required: true,
    min: 60,
    max: 250,
  },
  diastolic: {
    type: Number,
    required: true,
    min: 40,
    max: 150,
  },
  pulse: Number,
  arm: {
    type: String,
    enum: ["Left", "Right"],
    default: "Left",
  },
  position: {
    type: String,
    enum: ["Sitting", "Standing", "Lying"],
    default: "Sitting",
  },
  measurementTime: {
    type: Date,
    default: Date.now,
  },
  notes: String,
}, readingOptions);

/* --------------------- 🧪 LDL CHOLESTEROL --------------------- */
const LdlCholesterolSchema = new mongoose.Schema({
  ldl: {
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
    type: Date,
    default: Date.now,
  },
  notes: String,
}, readingOptions);

/* --------------------- 🍬 FASTING BLOOD GLUCOSE --------------------- */
const FastingBloodGlucoseSchema = new mongoose.Schema({
  bloodGlucose: {
    type: Number,
    required: true,
    min: 40,
    max: 600,
  },
  fastingHours: {
    type: Number,
    min: 0,
    max: 72,
  },
  measurementTime: {
    type: Date,
    default: Date.now,
  },
  notes: String,
}, readingOptions);

/* --------------------- ⚖️ HEALTHY WEIGHT --------------------- */
const HealthyWeightSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
    min: 50,
    max: 700, // lbs
  },
  heightFeet: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  heightInches: {
    type: Number,
    min: 0,
    max: 11,
  },
  waist: {
    type: Number,
    min: 0,
    max: 100,
  },
  measurementTime: {
    type: Date,
    default: Date.now,
  },
  notes: String,
}, readingOptions);

/* --------------------- 😌 STRESS MANAGEMENT --------------------- */
const StressManagementSchema = new mongoose.Schema({
  stressLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  measurementTime: {
    type: Date,
    default: Date.now,
  },
  notes: String,
}, readingOptions);

/* --------------------- 🚭 TOBACCO FREE --------------------- */
const TobaccoFreeSchema = new mongoose.Schema({
  tobaccoStatus: {
    type: String,
    enum: ["Non-smoker", "Former", "Current"],
    required: true,
  },
  measurementTime: {
    type: Date,
    default: Date.now,
  },
  notes: String,
}, readingOptions);


/* --------------------- 💉 VACCINES --------------------- */
const VaccinesSchema = new mongoose.Schema({
  vaccineStatus: {
    type: String,
    enum: ["UpToDate", "NeedToUpdate"],
    required: true,
  },
  lastCheckDate: {
    type: Date,
    required: true,
  },
  measurementTime: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    maxlength: 200,
  },
}, readingOptions);

/* --------------------- 🧍 FULL BODY CHECKUP --------------------- */
const FullBodyCheckupSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["Completed", "Pending"],
    required: true,
  },
  lastCheckupDate: {
    type: Date,
    required: true,
  },
  measurementTime: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    maxlength: 200,
  },
}, readingOptions);



/* --------------------- 🧾 MASTER HEALTH RECORD --------------------- */
const HealthRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bloodPressure: [BloodPressureSchema],
    ldlCholesterol: [LdlCholesterolSchema],
    fastingBloodGlucose: [FastingBloodGlucoseSchema],
    healthyWeight: [HealthyWeightSchema],
    stressManagement: [StressManagementSchema],
    tobaccoFree: [TobaccoFreeSchema],
    vaccines: [VaccinesSchema],
    fullBodyCheckup: [FullBodyCheckupSchema],
  },
  { timestamps: true }
);

const HealthRecord = mongoose.model("HealthRecord", HealthRecordSchema);
export default HealthRecord;
