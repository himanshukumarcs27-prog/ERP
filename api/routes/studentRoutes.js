import express from "express";
import {
  addStudent,
  fetchStudents,
  fetchStudent
} from "../controllers/studentController.js";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= CREATE STUDENT =================
// Only Admin & Teacher
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "teacher"),
  addStudent
);

// ================= GET ALL STUDENTS =================
// All logged-in users
router.get(
  "/",
  verifyToken,
  fetchStudents
);

// ================= GET SINGLE STUDENT =================
router.get(
  "/:id",
  verifyToken,
  fetchStudent
);

export default router;