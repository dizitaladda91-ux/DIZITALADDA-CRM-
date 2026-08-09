import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import ROLES from "../constants/roles.js";

import {
  getAllLeadSources,
  getLeadSourceById,
  createLeadSource,
  updateLeadSource,
  deleteLeadSource,
} from "../controllers/leadSourceController.js";

/**
 * =====================================================
 * SECURITY FIX (see audit notes):
 * This file previously had NO middleware at all on any
 * route - every endpoint, including create/update/delete,
 * was reachable by unauthenticated requests. Restored to
 * match the pattern used in leadRoutes.js: authMiddleware
 * on every route, roleMiddleware(ROLES.ADMIN) on writes.
 *
 * Read routes (GET) are left open to any authenticated
 * user (Admin or Counsellor), matching how leadRoutes.js
 * treats GET / and GET /:id for leads - lead sources are
 * reference data a Counsellor plausibly needs to see when
 * creating/filtering leads. Revisit if that assumption is
 * wrong for this app.
 *
 * NOTE: input validation is still missing here
 * (no leadSource.validator.js exists in the inventory).
 * That is a separate, already-flagged P0 item - fixing
 * the auth gap does not fix the validation gap.
 * =====================================================
 */

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getAllLeadSources
);

router.get(
  "/:id",
  authMiddleware,
  getLeadSourceById
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  createLeadSource
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  updateLeadSource
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  deleteLeadSource
);

export default router;