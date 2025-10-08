import express from "express";
import geminiRoutes from "./geminiRoutes.js"
import programRoutes from "./ProgramsRoute/programRoutes.js"

const router = express.Router();


router.use("/gemini", geminiRoutes);
router.use("/programs", programRoutes);

export default router;
