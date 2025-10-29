// routes/providerRoutes.js
import express from "express";
import { addBloodPressureReading, getLatestBloodPressure, getLatestBodyTemperature, addBodyTemperatureReading,addPulseRateReading,getLatestPulseRate,addRespiratoryRateReading, getLatestRespiratoryRate, addSpO2Reading, getLatestSpO2Reading, addStepCount, getStepCounts, getLatestHealthData, addVaccineReading, getLatestVaccineReading, getLatestFullBodyCheckupReading,addFullBodyCheckupReading} from "../../controllers/6NormalsController/6NormalsContoller.js";
import {
  addHealthRecord,
  updateHealthRecord,
  getAllHealthRecords,
  getLatestHealthRecords,
} from "../../controllers/6NormalsController/6NorController.js";

const router = express.Router();


// Add new record
router.post("/add", addHealthRecord);

// Update a record
router.put("/update", updateHealthRecord);

// Get all records for a user
router.get("/:userId", getAllHealthRecords);

router.get("/latest/:userId", getLatestHealthRecords);




//Blood Pressure
router.get("/bloodpressure", getLatestBloodPressure);
router.post("/bloodpressure", addBloodPressureReading);

//Body Temperature
router.get("/bodytemperature", getLatestBodyTemperature);
router.post("/bodytemperature", addBodyTemperatureReading);


router.post("/pulseRate",addPulseRateReading);
router.get("/pulseRate", getLatestPulseRate);

router.post("/respiratoryRate", addRespiratoryRateReading);
router.get("/respiratoryRate", getLatestRespiratoryRate);

router.post("/spo2", addSpO2Reading);
router.get("/spo2/latest", getLatestSpO2Reading);


router.post("/steps", addStepCount);
router.get("/steps", getStepCounts);


router.post("/vaccine", addVaccineReading);
router.get("/vaccine", getLatestVaccineReading);



router.post("/full-body-checkup", addFullBodyCheckupReading);
router.get("/full-body-checkup", getLatestFullBodyCheckupReading);

router.get("/health-data", getLatestHealthData);
export default router;


