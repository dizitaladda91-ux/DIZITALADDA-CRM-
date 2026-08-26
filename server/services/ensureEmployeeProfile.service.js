import pool from "../config/db.js";
import { findEmployeeByUserIdRepository } from "../repositories/employeeRepository.js";

/**
 * Standalone Ensure Employee Profile Service
 * Solves circular ESM dependencies permanently.
 */
export const ensureEmployeeProfileForUser = async (userId) => {
  if (!userId) return null;

  let employee = await findEmployeeByUserIdRepository(userId);
  if (employee) return employee;

  // Check user record in DB
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
    user.full_name || "Dizital Adda Staff",
    user.email,
    user.mobile || `980000${String(user.id).padStart(4, "0")}`,
    user.role || "COUNSELLOR",
  ]);

  return rows[0] || (await findEmployeeByUserIdRepository(userId));
};
