import express from "express";
import { chatbotController } from "../controllers/chatbotController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, chatbotController);

export default router;