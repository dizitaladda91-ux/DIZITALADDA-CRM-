import pool from "../config/db.js";
import {
  getDashboardSummaryRepository,
  getRecentLeadsRepository,
  getTodayFollowUpsRepository,
  getLeadStatusRepository,
} from "../repositories/employeePortal.repository.js";

import { findEmployeeByUserIdRepository } from "../repositories/employeeRepository.js";

/**
 * Ensure Employee Profile exists for User
 */
export const ensureEmployeeProfileForUser = async (userId) => {
  let employee = await findEmployeeByUserIdRepository(userId);
  if (employee) return employee;

  // Check user record
  const userRes = await pool.query("SELECT * FROM users WHERE id = $1 LIMIT 1;", [
    userId,
  ]);
  const user = userRes.rows[0];
  if (!user) return null;

  // Auto-create/link employee profile
  const empCode = `EMP${String(user.id).padStart(6, "0")}`;
  const insertQuery = `
    INSERT INTO employees (user_id, employee_code, full_name, email, mobile, role, department, designation, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'Admissions', 'Counsellor', 'ACTIVE')
    ON CONFLICT (email) DO UPDATE SET user_id = $1, status = 'ACTIVE'
    RETURNING *;
  `;

  const { rows } = await pool.query(insertQuery, [
    user.id,
    empCode,
    user.full_name || "IEM Staff",
    user.email,
    user.mobile || `980000${String(user.id).padStart(4, "0")}`,
    user.role || "COUNSELLOR",
  ]);

  return rows[0] || (await findEmployeeByUserIdRepository(userId));
};

export const getEmployeeDashboardService = async (userId) => {
  const employee = await ensureEmployeeProfileForUser(userId);

  if (!employee) {
    throw new Error("Employee profile could not be linked.");
  }

  const employeeId = employee.id;

  const [summary, recentLeads, todayFollowUps, leadStatus] = await Promise.all([
    getDashboardSummaryRepository(employeeId),
    getRecentLeadsRepository(employeeId),
    getTodayFollowUpsRepository(employeeId),
    getLeadStatusRepository(employeeId),
  ]);

  return {
    employee,
    summary,
    recentLeads,
    todayFollowUps,
    leadStatus,
  };
};