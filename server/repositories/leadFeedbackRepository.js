import pool from "../config/db.js";

/**
 * Insert a new feedback entry for a lead
 */
export const createLeadFeedbackRepository = async (
  client,
  { lead_id, status_at_feedback, feedback_fields = {}, remarks = null, created_by }
) => {
  const dbClient = client || pool;
  const query = `
    INSERT INTO lead_feedback (
      lead_id,
      status_at_feedback,
      feedback_fields,
      remarks,
      created_by
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    lead_id,
    status_at_feedback,
    JSON.stringify(feedback_fields),
    remarks || null,
    created_by || null,
  ];

  const result = await dbClient.query(query, values);
  return result.rows[0];
};

/**
 * Fetch feedback history for a specific lead ordered by created_at DESC
 */
export const getLeadFeedbackHistoryRepository = async (leadId) => {
  const query = `
    SELECT
      lf.id,
      lf.lead_id,
      lf.status_at_feedback,
      lf.feedback_fields,
      lf.remarks,
      lf.created_at,
      lf.created_by,
      COALESCE(u.full_name, 'System User') AS created_by_name,
      u.role AS created_by_role
    FROM lead_feedback lf
    LEFT JOIN users u ON lf.created_by = u.id
    WHERE lf.lead_id = $1
    ORDER BY lf.created_at DESC;
  `;

  const result = await pool.query(query, [leadId]);
  return result.rows;
};
