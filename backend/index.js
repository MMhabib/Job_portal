// index.js

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./db/connection.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors({
  origin: 'https://job-portal-six-zeta-99.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Health check
app.get("/", (req, res) => {
  res.send("API server is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
