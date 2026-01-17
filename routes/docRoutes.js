import express from "express";
import {
  createDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  requestAccess,
  approveAccess,
  addUserAccess,
} from "../controllers/docController.js";
import { authMiddleware as protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createDoc);
router.get("/", protect, getDocs);
router.put("/:docId", protect, updateDoc);
router.delete("/:docId", protect, deleteDoc);
router.post("/:docId/request", protect, requestAccess);
router.put("/:docId/requests/:requestId", protect, approveAccess);
router.post("/:docId/access", protect, addUserAccess);

export default router;
