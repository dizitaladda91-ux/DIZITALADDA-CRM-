import express from "express";
import {
  getAllLeadSources,
  getLeadSourceById,
  createLeadSource,
  updateLeadSource,
  deleteLeadSource,
} from "../controllers/leadSourceController.js";

const router = express.Router();

router.get("/", getAllLeadSources);
router.get("/:id", getLeadSourceById);
router.post("/", createLeadSource);
router.put("/:id", updateLeadSource);
router.delete("/:id", deleteLeadSource);

export default router;
