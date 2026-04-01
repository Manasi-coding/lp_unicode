import express from "express";
import { searchController } from "../controllers/searchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, searchController);

export default router;