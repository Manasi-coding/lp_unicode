import express from "express";

import {createUser, getUsers, getUser, updateUser, deleteUser} from '../controllers/userController.js';

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.get("/", protect, getUsers);

export default router;