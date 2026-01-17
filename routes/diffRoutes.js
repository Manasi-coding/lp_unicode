import express from "express";
import { diffVersions } from "../controllers/diffController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /documents/:docId/diff/:from/:to
router.get("/documents/:docId/diff/:from/:to", authMiddleware, diffVersions);

export default router;
