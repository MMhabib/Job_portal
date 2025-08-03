import express, { urlencoded } from "express";
import connectDB from "./db/connection.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

// connect db
connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

// middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: [
    "https://job-portal-six-zeta-99.vercel.app",  // replace with your actual frontend domain
    "http://localhost:5173",
  ],
  credentials: true,
};
app.use(cors(corsOptions));

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// No frontend static serving here
app.get('/', (req, res) => {
  res.send('API server is running');
});

app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});
