// routes/providerRoutes.js
import express from "express";
import { addBloodPressureReading, getLatestBloodPressure, getLatestBodyTemperature, addBodyTemperatureReading,addPulseRateReading,getLatestPulseRate,addRespiratoryRateReading, getLatestRespiratoryRate, addSpO2Reading, getLatestSpO2Reading, addStepCount, getStepCounts} from "../../controllers/6NormalsController/6NormalsContoller.js";

const router = express.Router();

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

// POST route for adding step count
router.post("/steps", addStepCount);

// GET route for retrieving step counts by user ID
router.get("/steps", getStepCounts);
export default router;


