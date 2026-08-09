import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import ROLES from "../constants/roles.js";

import {
  createDepartment,
  getAllDepartments,
} from "../controllers/departmentController.js";

/**
 * =====================================================
 * SECURITY FIX (see audit notes):
 * This file previously had NO middleware at all - both
 * routes, including the create/write route, were
 * reachable by unauthenticated requests. This is the
 * second route file found in this state (the first was
 * leadSourceRoutes.js), which changes this from an
 * isolated oversight to a confirmed pattern - every
 * remaining route file should be checked for the same
 * gap before considering the API surface safe.
 *
 * GET is left open to any authenticated user (Admin or
 * Counsellor), matching leadSourceRoutes.js's treatment
 * of reference data - a Counsellor plausibly needs to
 * see department names when creating/filtering leads or
 * viewing employee assignments. Revisit if that
 * assumption is wrong for this app.
 * =====================================================
 */

const router = express.Router();

// Create Department
router.post(
  "/",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  createDepartment
);

// Get All Departments
router.get(
  "/",
  authMiddleware,
  getAllDepartments
);

export default router;