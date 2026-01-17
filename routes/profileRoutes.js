import express from "express";
import upload from "../middleware/multer.js";
import { uploadProfileIcon } from "../controllers/profileController.js";
import { protect } from "../middleware/jwt.js";

const router = express.Router();

// Upload/update profile icon (protected)
router.post("/icon", protect, upload.single("icon"), uploadProfileIcon);

export default router;
