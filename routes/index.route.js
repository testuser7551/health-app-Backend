import express from "express";
import geminiRoutes from "./geminiRoutes.js"
import programRoutes from "./ProgramsRoute/programRoutes.js"
import careteamRoute from "./CareTeamRoute/CareTeamRoute.js"
import NormalsRoute from "./6Normals/6NormalsRoute.js"

const router = express.Router();


router.use("/gemini", geminiRoutes);
router.use("/programs", programRoutes);
router.use("/careteam", careteamRoute);
router.use("/normalsRoute", NormalsRoute);

export default router;
