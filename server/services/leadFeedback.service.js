import pool from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import auditLogger from "../utils/auditLogger.js";

import { findLeadByIdRepository } from "../repositories/leadRepository.js";
import {
  createLeadFeedbackRepository,
  getLeadFeedbackHistoryRepository,
} from "../repositories/leadFeedbackRepository.js";
import { calculateLeadPriority } from "./leadPriority.service.js";
import { addTimelineEventService } from "./leadTimeline.service.js";
import TIMELINE_ACTIVITY from "../constants/timelineActivity.js";

/**
 * Add a structured feedback entry to a lead and automatically update lead status & priority
 */
export const addLeadFeedbackService = async (
  leadId,
  feedbackData,
  currentUser,
  req
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const lead = await findLeadByIdRepository(leadId);
    if (!lead) {
      throw new ApiError(404, "Lead not found.");
    }

    const {
      status,
      feedback_fields = {},
      remarks = null,
    } = feedbackData;

    const targetStatus = status || lead.status;
    const nextFollowup = feedback_fields.next_followup || lead.next_followup || null;

    // 1. Save Feedback record
    const feedbackRecord = await createLeadFeedbackRepository(client, {
      lead_id: leadId,
      status_at_feedback: targetStatus,
      feedback_fields,
      remarks: remarks || feedback_fields.note || feedback_fields.remarks || null,
      created_by: currentUser.id,
    });

    // 2. Calculate automatic Priority based on rules
    const calculatedPriority = calculateLeadPriority({
      status: targetStatus,
      createdAt: lead.created_at,
      nextFollowup,
    });

    // 3. Update lead status, priority, next_followup and feedback summary in leads table
    const updateQuery = `
      UPDATE leads
      SET
        status = $1,
        priority = $2,
        next_followup = $3,
        feedback = $4,
        updated_by = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *;
    `;

    const summaryText = remarks || feedback_fields.note || feedback_fields.reason || feedback_fields.rejection_reason || lead.feedback;

    const updateResult = await client.query(updateQuery, [
      targetStatus,
      calculatedPriority,
      nextFollowup,
      summaryText,
      currentUser.id,
      leadId,
    ]);

    const updatedLead = updateResult.rows[0];

    // 4. Log Timeline event
    await addTimelineEventService({
      leadId,
      employeeId: lead.assigned_to,
      activityType: TIMELINE_ACTIVITY.STATUS_CHANGED,
      title: "Lead Feedback & Status Updated",
      description: `Status: ${targetStatus}. Priority auto-set to ${calculatedPriority}. Note: ${summaryText || "No remarks"}`,
      oldValue: lead.status,
      newValue: targetStatus,
    });

    auditLogger({
      action: "LEAD_FEEDBACK_ADDED",
      module: "LEAD",
      userId: currentUser.id,
      role: currentUser.role,
      entityId: leadId,
      requestId: req?.requestId,
      ip: req?.ip,
    });

    await client.query("COMMIT");

    // Fetch refreshed feedback history
    const feedbackHistory = await getLeadFeedbackHistoryRepository(leadId);

    return {
      lead: updatedLead,
      feedback: feedbackRecord,
      history: feedbackHistory,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get feedback history timeline for a lead
 */
export const getLeadFeedbackHistoryService = async (leadId) => {
  const lead = await findLeadByIdRepository(leadId);
  if (!lead) {
    throw new ApiError(404, "Lead not found.");
  }

  return await getLeadFeedbackHistoryRepository(leadId);
};
