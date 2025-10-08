import express from "express";
import { generateGeminiResponse, summaryGeminiResponse } from "../controllers/geminiController.js";

const router = express.Router();

router.post("/", generateGeminiResponse);
router.post("/chatsummary", summaryGeminiResponse);

export default router;
