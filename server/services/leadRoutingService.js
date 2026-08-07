import pool, { withTransaction } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { findEmployeeByIdRepository } from "../repositories/employeeRepository.js";
import {
  applyAutomaticAssignmentRepository,
  createCourseRepository,
  createDomainRepository,
  createRoutingAssignmentRepository,
  deleteRoutingAssignmentRepository,
  findDomainCourseRepository,
  getDomainsRepository,
  getRoutingAssignmentsRepository,
  markRoutingAssignmentUsedRepository,
  recordAutomaticAssignmentHistoryRepository,
  recordRoutingTimelineRepository,
  selectNextCounsellorRepository,
} from "../repositories/leadRoutingRepository.js";

export const getRoutingSetupService = () => withTransaction(async (client) => ({
  domains: await getDomainsRepository(client),
  assignments: await getRoutingAssignmentsRepository(client),
}));

export const createDomainService = (name) => withTransaction(async (client) => {
  if (!name?.trim()) throw new ApiError(400, "Domain name is required.");
  return createDomainRepository(client, name.trim());
});

export const createCourseService = ({ domain_id, name }) => withTransaction(async (client) => {
  if (!domain_id || !name?.trim()) throw new ApiError(400, "Domain and course name are required.");
  return createCourseRepository(client, domain_id, name.trim());
});

export const createRoutingAssignmentService = ({ employee_id, domain_id, course_id = null, auto_assign = true }) => withTransaction(async (client) => {
  const employee = await findEmployeeByIdRepository(employee_id);
  if (!employee || employee.status !== "ACTIVE" || employee.role !== "COUNSELLOR") {
    throw new ApiError(400, "Routing can only be assigned to an active counsellor.");
  }
  return createRoutingAssignmentRepository(client, { employeeId: employee_id, domainId: domain_id, courseId: course_id, autoAssign: auto_assign });
});

export const removeRoutingAssignmentService = (id) => withTransaction(async (client) => {
  const assignment = await deleteRoutingAssignmentRepository(client, id);
  if (!assignment) throw new ApiError(404, "Routing assignment not found.");
  return assignment;
});

export const autoAssignLeadService = async (client, lead) => {
  if (!lead.domain || !lead.interested_course) return { assigned: false, reason: "Domain or course was not supplied." };
  const route = await findDomainCourseRepository(client, lead.domain, lead.interested_course);
  if (!route?.course_id) return { assigned: false, reason: "No active course routing rule was found." };
  const nextCounsellor = await selectNextCounsellorRepository(client, { domainId: route.domain_id, courseId: route.course_id });
  if (!nextCounsellor) return { assigned: false, reason: "No eligible active counsellor was found." };

  const ruleDescription = `Auto-assigned by round robin: ${route.domain_name} → ${route.course_name}.`;
  const assignedLead = await applyAutomaticAssignmentRepository(client, { leadId: lead.id, employeeId: nextCounsellor.employee_id, ruleDescription });
  await markRoutingAssignmentUsedRepository(client, nextCounsellor.routing_assignment_id);
  await recordAutomaticAssignmentHistoryRepository(client, { leadId: lead.id, employeeId: nextCounsellor.employee_id, remarks: ruleDescription });
  await recordRoutingTimelineRepository(client, { leadId: lead.id, employeeId: nextCounsellor.employee_id, title: "Lead Auto-assigned", description: `${ruleDescription} Assigned to ${nextCounsellor.full_name}.` });
  return { assigned: true, lead: assignedLead, employee: nextCounsellor };
};
