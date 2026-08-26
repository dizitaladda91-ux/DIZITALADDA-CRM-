import pool from "../config/db.js";

/**
 * Dashboard Summary Repository
 * Supports standardized statuses: NEW, INTERESTED, FOLLOW_UP, VISITED, ENROLLED, NOT_INTERESTED
 */
export const getDashboardSummaryRepository = async (employeeId) => {
  const query = `
    SELECT
      COUNT(*) FILTER (
        WHERE assigned_to = $1
        AND is_deleted = FALSE
      )::INT AS assigned_leads,

      COUNT(*) FILTER (
        WHERE assigned_to = $1
        AND (DATE(next_followup) = CURRENT_DATE OR UPPER(status) = 'FOLLOW_UP')
        AND is_deleted = FALSE
      )::INT AS today_followups,

      COUNT(*) FILTER (
        WHERE assigned_to = $1
        AND UPPER(status) IN ('QUALIFIED', 'INTERESTED')
        AND is_deleted = FALSE
      )::INT AS interested_leads,

      COUNT(*) FILTER (
        WHERE assigned_to = $1
        AND UPPER(status) IN ('VISITED', 'CAMPUS_VISITED')
        AND is_deleted = FALSE
      )::INT AS visited_leads,

      COUNT(*) FILTER (
        WHERE assigned_to = $1
        AND UPPER(status) IN ('ADMISSION', 'ADMISSION_DONE', 'ENROLLED')
        AND is_deleted = FALSE
      )::INT AS admissions

    FROM leads;
  `;

  const { rows } = await pool.query(query, [employeeId]);
  return rows[0] || {};
};

/**
 * Recent Leads
 */
export const getRecentLeadsRepository = async (employeeId) => {
  const query = `
    SELECT
      id,
      lead_code,
      full_name,
      mobile,
      status,
      priority,
      next_followup,
      created_at
    FROM leads
    WHERE
      assigned_to = $1
      AND is_deleted = FALSE
    ORDER BY created_at DESC
    LIMIT 10;
  `;

  const { rows } = await pool.query(query, [employeeId]);
  return rows;
};

/**
 * Today's Follow-ups
 */
export const getTodayFollowUpsRepository = async (employeeId) => {
  const query = `
    SELECT
      id,
      lead_code,
      full_name,
      mobile,
      status,
      priority,
      next_followup
    FROM leads
    WHERE
      assigned_to = $1
      AND (DATE(next_followup) = CURRENT_DATE OR UPPER(status) = 'FOLLOW_UP')
      AND is_deleted = FALSE
    ORDER BY next_followup ASC;
  `;

  const { rows } = await pool.query(query, [employeeId]);
  return rows;
};

/**
 * Lead Status Analytics
 */
export const getLeadStatusRepository = async (employeeId) => {
  const query = `
    SELECT
      UPPER(status) AS status,
      COUNT(*)::INT AS total
    FROM leads
    WHERE
      assigned_to = $1
      AND is_deleted = FALSE
    GROUP BY UPPER(status)
    ORDER BY status;
  `;

  const { rows } = await pool.query(query, [employeeId]);
  return rows;
};

/**
 * Monthly Admissions
 */
export const getMonthlyAdmissionsRepository = async (employeeId) => {
  const query = `
    SELECT
      TO_CHAR(created_at, 'Mon YYYY') AS month,
      COUNT(*)::INT AS total
    FROM leads
    WHERE
      assigned_to = $1
      AND UPPER(status) IN ('ADMISSION', 'ADMISSION_DONE', 'ENROLLED')
      AND is_deleted = FALSE
    GROUP BY TO_CHAR(created_at, 'Mon YYYY'), DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at) DESC
    LIMIT 6;
  `;

  const { rows } = await pool.query(query, [employeeId]);
  return rows;
};