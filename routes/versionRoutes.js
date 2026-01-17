import express from "express";
import {
  // don't include createVersionSnapshot as routes are only for (req, res) consts
  getVersionHistory,
  restoreVersion,
} from "../controllers/versionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/documents/:docId/versions", authMiddleware, getVersionHistory);

router.post(
  "/documents/:docId/versions/:versionId/restore",
  authMiddleware,
  restoreVersion
);

export default router;
