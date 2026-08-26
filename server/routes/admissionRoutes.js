import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getAdmissions,
  createAdmission,
  collectFee,
} from "../controllers/admissionController.js";

const router = express.Router();

router.get("/", authMiddleware, getAdmissions);
router.post("/", authMiddleware, createAdmission);
router.patch("/:id/fee", authMiddleware, collectFee);

export default router;
