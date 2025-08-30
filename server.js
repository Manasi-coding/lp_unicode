import express from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import { requestLogger } from "./middleware/logger.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(requestLogger);

app.use("/api/users", userRoutes);

app.get("/", (req,res) => {
    res.send("THE API IS NOW RUNNING!");
});

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));