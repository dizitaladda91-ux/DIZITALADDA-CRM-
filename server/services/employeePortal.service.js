import {
  getDashboardSummaryRepository,
  getRecentLeadsRepository,
  getTodayFollowUpsRepository,
  getLeadStatusRepository,
} from "../repositories/employeePortal.repository.js";
import { ensureEmployeeProfileForUser } from "./ensureEmployeeProfile.service.js";

export { ensureEmployeeProfileForUser };

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