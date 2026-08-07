import asyncHandler from "../utils/asyncHandler.js";

import {
  createFollowupService,
  getAllFollowupsService,
  getFollowupByIdService,
  updateFollowupService,
  completeFollowupService,
  rescheduleFollowupService,
  deleteFollowupService,
  restoreFollowupService,
  getFollowupStatisticsService,
  getLeadTimelineService,
  bulkCompleteFollowupsService,
  bulkDeleteFollowupsService,
  bulkRestoreFollowupsService,
  bulkAssignFollowupsService,
} from "../services/followupService.js";
import { findEmployeeByUserIdRepository } from "../repositories/employeeRepository.js";


/**
 * ============================================================================
 * Create Follow-up
 * ============================================================================
 */
export const createFollowup = asyncHandler(
  async (req, res) => {

    const followup =
      await createFollowupService(
        req.body,
        req.user
      );

    res.status(201).json({
      success: true,
      message: "Follow-up created successfully.",
      data: followup,
    });

  }
);

/**
 * ============================================================================
 * Get All Follow-ups
 * ============================================================================
 */
export const getAllFollowups = asyncHandler(
  async (req, res) => {

    const filters = { ...req.query };

    if (req.user.role === "COUNSELLOR") {
      const employee = await findEmployeeByUserIdRepository(req.user.id);
      if (!employee) {
        return res.status(200).json({ success: true, message: "Follow-ups fetched successfully.", data: { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } } });
      }
      filters.employeeId = employee.id;
    }

    const followups =
      await getAllFollowupsService(
        filters
      );

    res.status(200).json({
      success: true,
      message: "Follow-ups fetched successfully.",
      data: followups,
    });

  }
);

export const getFollowupById = asyncHandler(
  async (req, res) => {

    const followup =
      await getFollowupByIdService(
        req.params.id,
        req.user
      );

    res.status(200).json({
      success: true,
      message: "Follow-up fetched successfully.",
      data: followup,
    });

  }
);

export const updateFollowup = asyncHandler(
  async (req, res) => {

    const followup =
      await updateFollowupService(
        req.params.id,
        req.body,
        req.user
      );

    res.status(200).json({
      success: true,
      message: "Follow-up updated successfully.",
      data: followup,
    });

  }
);

export const completeFollowup = asyncHandler(
  async (req, res) => {

    const followup =
      await completeFollowupService(
        req.params.id,
        req.body,
        req.user
      );

    res.status(200).json({
      success: true,
      message: "Follow-up completed successfully.",
      data: followup,
    });

  }
);

export const rescheduleFollowup = asyncHandler(
  async (req, res) => {

    const followup =
      await rescheduleFollowupService(
        req.params.id,
        req.body,
        req.user
      );

    res.status(200).json({
      success: true,
      message: "Follow-up rescheduled successfully.",
      data: followup,
    });

  }
);

export const deleteFollowup = asyncHandler(
  async (req, res) => {

    const followup =
      await deleteFollowupService(
        req.params.id,
        req.user
      );

    res.status(200).json({
      success: true,
      message: "Follow-up deleted successfully.",
      data: followup,
    });

  }
);

export const restoreFollowup = asyncHandler(
  async (req, res) => {

    const followup =
      await restoreFollowupService(
        req.params.id,
        req.user
      );

    res.status(200).json({
      success: true,
      message: "Follow-up restored successfully.",
      data: followup,
    });

  }
);

export const getFollowupStatistics = asyncHandler(
  async (req, res) => {

    const statistics =
      await getFollowupStatisticsService();

    res.status(200).json({
      success: true,
      message: "Follow-up statistics fetched successfully.",
      data: statistics,
    });

  }
);

export const getLeadTimeline = asyncHandler(
  async (req, res) => {

    const timeline =
      await getLeadTimelineService(
        req.params.leadId
      );

    res.status(200).json({
      success: true,
      message: "Lead timeline fetched successfully.",
      data: timeline,
    });

  }
);

export const bulkCompleteFollowups = asyncHandler(
  async (req, res) => {

    const result =
      await bulkCompleteFollowupsService(
        req.body,
        req.user
      );

    res.status(200).json({
      success: true,
      message: "Bulk follow-ups completed successfully.",
      data: result,
    });

  }
);

export const bulkDeleteFollowups = asyncHandler(
  async (req, res) => {

    const result =
      await bulkDeleteFollowupsService(
        req.body,
        req.user
      );

    res.status(200).json({
      success: true,
      message: "Bulk follow-ups deleted successfully.",
      data: result,
    });

  }
);

export const bulkRestoreFollowups = asyncHandler(
  async (req, res) => {

    const result =
      await bulkRestoreFollowupsService(
        req.body,
        req.user
      );

    res.status(200).json({
      success: true,
      message: "Bulk follow-ups restored successfully.",
      data: result,
    });

  }
);

export const bulkAssignFollowups = asyncHandler(
  async (req, res) => {

    const result =
      await bulkAssignFollowupsService(
        req.body,
        req.user
      );

    res.status(200).json({
      success: true,
      message: "Bulk follow-ups assigned successfully.",
      data: result,
    });

  }
);

