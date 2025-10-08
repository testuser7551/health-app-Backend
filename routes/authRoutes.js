import express from "express";
import { registerUser, loginUser,  getUserById } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.use(authMiddleware);
router.get("/user", getUserById);

export default router;
