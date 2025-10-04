import express from "express";
import upload from "../middleware/multer";
import { uploadProfileIcon } from "../controllers/profileController";

const router = express.Router();

router.post("/profile/icon", upload.single("icon"), uploadProfileIcon);

export default router;
