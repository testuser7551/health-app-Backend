import express from "express";
import { getAllPrograms, enrollUserToProgram, trackUserDay, getProgramProgress } from "../../controllers/ProgramsController/programsController.js";

const router = express.Router();

router.get("/getprograms", getAllPrograms);
router.post("/enrollprograms", enrollUserToProgram);
router.post("/track-day", trackUserDay);
router.get("/progress", getProgramProgress);

export default router;
