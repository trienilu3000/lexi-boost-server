import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import vocabularyRoutes from "./routes/vocabulary.routes";
import authRoutes from "./routes/auth.routes";
import learningRoutes from "./routes/learning.routes";
import userProgressRoutes from "./routes/userProgress.routes";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";

dotenv.config();

const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req: any) => req.user?.userId || req.ip,
  message: "Too many requests, please try again later.",
});
// Cors
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));
app.use(passport.initialize());
app.use(limiter);

// Router
app.use("/api", vocabularyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/user-progress", userProgressRoutes);
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log("Database connection error:", error));
