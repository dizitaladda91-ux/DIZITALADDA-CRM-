import pool from "../config/db.js";
import { findEmployeeByUserIdRepository } from "../repositories/employeeRepository.js";

/**
 * Role-Based Notification Service
 * Admin: Unassigned leads, confirmed admissions, system-wide overdue follow-ups
 * Employee: Today's scheduled calls, overdue reminders, newly assigned leads
 */
export const getRoleNotificationsService = async (user) => {
  const isAdmin = user.role === "ADMIN";

  if (isAdmin) {
    const [unassignedLeads, admissions, overdueFollowups] = await Promise.all([
      pool.query(`
        SELECT id, lead_code, full_name, mobile, status, created_at
        FROM leads
        WHERE assigned_to IS NULL AND is_deleted = FALSE
        ORDER BY created_at DESC LIMIT 10
      `),
      pool.query(`
        SELECT id, lead_code, full_name, mobile, status, updated_at
        FROM leads
        WHERE UPPER(status) IN ('ADMISSION', 'ADMISSION_DONE', 'ENROLLED') AND is_deleted = FALSE
        ORDER BY updated_at DESC LIMIT 10
      `),
      pool.query(`
        SELECT id, lead_code, full_name, mobile, status, next_followup
        FROM leads
        WHERE DATE(next_followup) < CURRENT_DATE AND is_deleted = FALSE
        ORDER BY next_followup ASC LIMIT 10
      `),
    ]);

    const notifications = [
      ...unassignedLeads.rows.map((l) => ({
        id: `unassigned-${l.id}`,
        type: "UNASSIGNED_LEAD",
        category: "Action Required",
        title: "Unassigned New Lead",
        message: `Lead ${l.full_name} (${l.lead_code || "NEW"}) requires assignment to a counsellor.`,
        leadId: l.id,
        createdAt: l.created_at,
        isRead: false,
      })),
      ...admissions.rows.map((l) => ({
        id: `admission-${l.id}`,
        type: "ADMISSION_CONFIRMED",
        category: "Admissions",
        title: "Confirmed Admission",
        message: `Student ${l.full_name} (${l.lead_code || "ENROLLED"}) confirmed admission.`,
        leadId: l.id,
        createdAt: l.updated_at,
        isRead: false,
      })),
      ...overdueFollowups.rows.map((l) => ({
        id: `overdue-${l.id}`,
        type: "OVERDUE_FOLLOWUP",
        category: "Follow-ups",
        title: "Overdue Follow-up Alert",
        message: `Follow-up for ${l.full_name} is overdue.`,
        leadId: l.id,
        createdAt: l.next_followup,
        isRead: false,
      })),
    ];

    return {
      unreadCount: notifications.length,
      notifications,
    };
  }

  // COUNSELLOR / EMPLOYEE PORTAL
  const employee = await findEmployeeByUserIdRepository(user.id);
  const employeeId = employee ? employee.id : null;

  if (!employeeId) {
    return { unreadCount: 0, notifications: [] };
  }

  const [todayCalls, overdueCalls, newAssigned] = await Promise.all([
    pool.query(
      `
      SELECT id, lead_code, full_name, mobile, status, next_followup
      FROM leads
      WHERE assigned_to = $1 AND DATE(next_followup) = CURRENT_DATE AND is_deleted = FALSE
      ORDER BY next_followup ASC LIMIT 10
    `,
      [employeeId]
    ),
    pool.query(
      `
      SELECT id, lead_code, full_name, mobile, status, next_followup
      FROM leads
      WHERE assigned_to = $1 AND DATE(next_followup) < CURRENT_DATE AND is_deleted = FALSE
      ORDER BY next_followup ASC LIMIT 10
    `,
      [employeeId]
    ),
    pool.query(
      `
      SELECT id, lead_code, full_name, mobile, status, created_at
      FROM leads
      WHERE assigned_to = $1 AND UPPER(status) = 'NEW' AND is_deleted = FALSE
      ORDER BY created_at DESC LIMIT 10
    `,
      [employeeId]
    ),
  ]);

  const notifications = [
    ...todayCalls.rows.map((l) => ({
      id: `today-${l.id}`,
      type: "TODAY_CALL",
      category: "Follow-ups",
      title: "Today's Scheduled Call",
      message: `Call scheduled today for ${l.full_name} (${l.mobile}).`,
      leadId: l.id,
      createdAt: l.next_followup,
      isRead: false,
    })),
    ...overdueCalls.rows.map((l) => ({
      id: `overdue-emp-${l.id}`,
      type: "OVERDUE_CALL",
      category: "Follow-ups",
      title: "Overdue Call Reminder",
      message: `Follow-up for ${l.full_name} is overdue. Please call ASAP.`,
      leadId: l.id,
      createdAt: l.next_followup,
      isRead: false,
    })),
    ...newAssigned.rows.map((l) => ({
      id: `new-assigned-${l.id}`,
      type: "NEW_ASSIGNED",
      category: "All",
      title: "New Lead Assigned",
      message: `New lead ${l.full_name} (${l.lead_code || "LEAD"}) assigned to you.`,
      leadId: l.id,
      createdAt: l.created_at,
      isRead: false,
    })),
  ];

  return {
    unreadCount: notifications.length,
    notifications,
  };
};
