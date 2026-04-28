import express from "express";
import {
  addMarksController,
  getMarksBySubject
} from "./controllers/markController.js";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Add Marks (Teacher only)
router.post(
  "/add",
  verifyToken,
  authorizeRoles("teacher"),
  addMarksController
);

// ✅ Get Marks by Subject (FILTER API 🔥)
// URL: /api/marks?subject_id=...
router.get(
  "/",
  verifyToken,
  authorizeRoles("teacher"),
  getMarksBySubject
);

export default router;