import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import { authMiddleware } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js"

import index from "./routes/index.route.js"


dotenv.config();
connectDB(); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

//public routes
app.use("/api/auth",authRoutes);

//protected routes
app.use(authMiddleware);
app.use("/api", index);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
