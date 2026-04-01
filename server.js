import express from "express";
import dotenv from "dotenv";
dotenv.config();
console.log("JWT_SECRET =", process.env.JWT_SECRET);

import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import docRoutes from "./routes/docRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

import { requestLogger, appLogger } from "./middleware/logger.js";
import { protect } from "./middleware/jwt.js";

//import multer

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger); // logs every HTTP request

// Routes
app.use("/api/auth", authRoutes); // public routes (login/register)
app.use("/api/users", protect, userRoutes); // protected routes (require JWT)
app.use("/api/profile", profileRoutes);
app.use("/api/docs", protect, docRoutes); // protect all doc routes
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/search", searchRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("THE API IS NOW RUNNING!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  appLogger.info(`Server running on http://localhost:${PORT}`)
);
