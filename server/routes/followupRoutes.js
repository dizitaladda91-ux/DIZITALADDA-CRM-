import { Router } from "express";

import {
  createFollowup,
  getAllFollowups,
  getFollowupById,
  updateFollowup,
  completeFollowup,
  rescheduleFollowup,
  deleteFollowup,
  restoreFollowup,
  getFollowupStatistics,
  getLeadTimeline, 
  bulkCompleteFollowups,
  bulkDeleteFollowups,
  bulkRestoreFollowups,
  bulkAssignFollowups,
} from "../controllers/followupController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "COUNSELLOR"),
  createFollowup
);

router.get(
  "/",
  authMiddleware,
  getAllFollowups
);

router.get(
  "/statistics",
  authMiddleware,
  getFollowupStatistics
);

router.get(
  "/timeline/:leadId",
  authMiddleware,
  getLeadTimeline
);

router.get(
  "/:id",
  authMiddleware,
  getFollowupById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "COUNSELLOR"),
  updateFollowup
);

router.patch(
  "/:id/complete",
  authMiddleware,
  roleMiddleware("ADMIN", "COUNSELLOR"),
  completeFollowup
);

router.patch(
  "/:id/reschedule",
  authMiddleware,
  roleMiddleware("ADMIN", "COUNSELLOR"),
  rescheduleFollowup
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteFollowup
);

router.patch(
  "/:id/restore",
  authMiddleware,
  roleMiddleware("ADMIN"),
  restoreFollowup
);

router.patch(
  "/bulk/complete",
  authMiddleware,
  roleMiddleware("ADMIN", "COUNSELLOR"),
  bulkCompleteFollowups
);

router.patch(
  "/bulk/restore",
  authMiddleware,
  roleMiddleware("ADMIN"),
  bulkRestoreFollowups
);

router.patch(
  "/bulk/assign",
  authMiddleware,
  roleMiddleware("ADMIN"),
  bulkAssignFollowups
);

router.delete(
  "/bulk",
  authMiddleware,
  roleMiddleware("ADMIN"),
  bulkDeleteFollowups
);

export default router;