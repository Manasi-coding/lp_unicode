import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { requestLogger, appLogger } from "./middleware/logger.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req,res) => {
    res.send("THE API IS NOW RUNNING!");
});

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));