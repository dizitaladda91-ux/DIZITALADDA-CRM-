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
 * Add a structured feedback entry to a lead and automatically update lead profile, status & priority
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
      personal_info = {},
      academic_info = {},
    } = feedbackData;

    const targetStatus = status || lead.status;
    const nextFollowup = feedback_fields.next_followup || academic_info.next_followup || lead.next_followup || null;

    // Merge personal & academic information updates onto lead profile
    const fullName = personal_info.full_name || feedback_fields.full_name || lead.full_name;
    const mobile = personal_info.mobile || feedback_fields.mobile || lead.mobile;
    const alternateMobile = personal_info.alternate_mobile !== undefined ? personal_info.alternate_mobile : (feedback_fields.alternate_mobile || lead.alternate_mobile);
    const email = personal_info.email !== undefined ? personal_info.email : (feedback_fields.email || lead.email);
    const city = personal_info.city !== undefined ? personal_info.city : (feedback_fields.city || lead.city);
    const state = personal_info.state !== undefined ? personal_info.state : (feedback_fields.state || lead.state);
    const interestedCourse = academic_info.interested_course || feedback_fields.interested_course || lead.interested_course;
    const preferredCentre = academic_info.preferred_centre || feedback_fields.preferred_centre || lead.preferred_centre;

    // 1. Save Feedback record
    const feedbackRecord = await createLeadFeedbackRepository(client, {
      lead_id: leadId,
      status_at_feedback: targetStatus,
      feedback_fields: {
        ...feedback_fields,
        ...personal_info,
        ...academic_info,
      },
      remarks: remarks || feedback_fields.note || feedback_fields.remarks || null,
      created_by: currentUser.id,
    });

    // 2. Calculate automatic Priority based on rules
    const calculatedPriority = calculateLeadPriority({
      status: targetStatus,
      createdAt: lead.created_at,
      nextFollowup,
    });

    // 3. Update lead status, priority, personal & academic details in leads table
    const updateQuery = `
      UPDATE leads
      SET
        full_name = $1,
        mobile = $2,
        alternate_mobile = $3,
        email = $4,
        city = $5,
        state = $6,
        interested_course = $7,
        preferred_centre = $8,
        status = $9,
        priority = $10,
        next_followup = $11,
        feedback = $12,
        updated_by = $13,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *;
    `;

    const summaryText = remarks || feedback_fields.note || feedback_fields.reason || feedback_fields.rejection_reason || lead.feedback;

    const updateResult = await client.query(updateQuery, [
      fullName,
      mobile,
      alternateMobile,
      email,
      city,
      state,
      interestedCourse,
      preferredCentre,
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
      title: "Lead Details & Feedback Updated",
      description: `Status: ${targetStatus}. Priority auto-set to ${calculatedPriority}. Note: ${summaryText || "Updated lead profile"}`,
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
