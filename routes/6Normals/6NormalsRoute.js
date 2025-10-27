// routes/providerRoutes.js
import express from "express";
import { addBloodPressureReading, getLatestBloodPressure } from "../../controllers/6NormalsController/6NormalsContoller.js";

const router = express.Router();

//Blood Pressure
router.get("/bloodpressure", getLatestBloodPressure);
router.post("/bloodpressure", addBloodPressureReading);


export default router;


