import express from "express";
import { exportDocumentPDF } from "../controllers/pdfController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//GET /documents/:docId/export/pdf
router.get("/documents/:docId/export/pdf", authMiddleware, exportDocumentPDF);

export default router;
