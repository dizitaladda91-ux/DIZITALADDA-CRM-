import express from "express";
import {
  assignLead,
  reassignLead,
  getLeadAssignmentHistory,
} from "../controllers/leadAssignmentController.js";

import verifyToken from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import ROLES from "../constants/roles.js";

/**
 * =====================================================
 * SECURITY FIX (see audit notes):
 * This file previously had authMiddleware but NO role
 * restriction on assign/reassign - a second, parallel
 * path to the admin-only assignment action already
 * correctly gated in leadRoutes.js (PATCH /:id/assign).
 * Any authenticated Counsellor could assign/reassign any
 * lead to any employee via this route. Added
 * roleMiddleware(ROLES.ADMIN) to match the intended
 * restriction.
 *
 * History (GET) is left open to any authenticated user
 * for now, matching the read-permissiveness pattern used
 * elsewhere (e.g. campaign GET routes) - but note this
 * still has no per-lead ownership check, meaning a
 * Counsellor can view assignment history for leads that
 * are not theirs. Flagged separately; revisit alongside
 * the broader "should reads be ownership-scoped by
 * default" product decision.
 * =====================================================
 */

const router = express.Router();

router.put(
  "/:leadId/assign",
  verifyToken,
  roleMiddleware(ROLES.ADMIN),
  assignLead
);

router.put(
  "/:leadId/reassign",
  verifyToken,
  roleMiddleware(ROLES.ADMIN),
  reassignLead
);

router.get(
  "/:leadId/history",
  verifyToken,
  getLeadAssignmentHistory
);

export default router;