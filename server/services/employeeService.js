import { withTransaction } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import auditLogger from "../utils/auditLogger.js";
import { isValidRole } from "../constants/roles.js";
import bcrypt from "bcrypt";

import {
    createUserRepository,
    findUserByEmailRepository,
    updateUserRepository,
    softDeleteUserRepository,
    restoreUserRepository,
} from "../repositories/userRepository.js";

import {
    getNextEmployeeCodeRepository,
    createEmployeeRepository,

    findEmployeeByIdRepository,
    findEmployeeByEmailRepository,
    findEmployeeByMobileRepository,

    updateEmployeeRepository,
    deleteEmployeeRepository,
    restoreEmployeeRepository,

    getEmployeesRepository,
    getEmployeeStatisticsRepository,
    getEmployeePerformanceRepository,

} from "../repositories/employeeRepository.js";

import {
  getMyLeadsRepository,
} from "../repositories/leadRepository.js";

import {
  findEmployeeByUserIdRepository,
} from "../repositories/employeeRepository.js";
import { createRoutingAssignmentRepository } from "../repositories/leadRoutingRepository.js";

/* =====================================================
 * Helpers
 * ===================================================== */

const generateEmployeeCode = (sequence) => {
    const prefix = process.env.EMPLOYEE_CODE_PREFIX || "EMP";
    return `${prefix}${String(sequence).padStart(6, "0")}`;
};

const safeAuditLog = (payload) => {
    try {
        auditLogger(payload);
    } catch (error) {
        console.error("Audit Logger Error:", error.message);
    }
};

/* =====================================================
 * Create Employee
 * ===================================================== */

export const createEmployeeService = async (
    employeeData,
    currentUser,
    req
) => {
     


    // Normalize Data
    employeeData.email = employeeData.email.trim().toLowerCase();
    employeeData.full_name = employeeData.full_name.trim();
    employeeData.mobile = employeeData.mobile.trim();

    // Duplicate Employee Email
    const existingEmployee =
        await findEmployeeByEmailRepository(employeeData.email);

    if (existingEmployee) {
        throw new ApiError(
            409,
            "Employee email already exists."
        );
    }

    // Duplicate User Email
    const existingUser =
        await findUserByEmailRepository(employeeData.email);

    if (existingUser) {
        throw new ApiError(
            409,
            "User email already exists."
        );
    }

    // Duplicate Mobile
    const existingMobile =
        await findEmployeeByMobileRepository(employeeData.mobile);

    if (existingMobile) {
        throw new ApiError(
            409,
            "Mobile number already exists."
        );
    }

    // Role Validation
    if (!isValidRole(employeeData.role)) {
        throw new ApiError(
            400,
            "Invalid employee role."
        );
    }

    return await withTransaction(async (client) => {

        // Employee Code
        const sequence =
            await getNextEmployeeCodeRepository(client);

        const employeeCode =
            generateEmployeeCode(sequence);

        // Password
        const temporaryPassword =
            employeeData.password ||
            process.env.DEFAULT_EMPLOYEE_PASSWORD;

        const hashedPassword =
            await bcrypt.hash(
                temporaryPassword,
                10
            );

        // Create User
        const user =
            await createUserRepository(
                client,
                {
                    full_name: employeeData.full_name,
                    email: employeeData.email,
                    password: hashedPassword,
                    role: employeeData.role,
                }
            );

        // Create Employee
        const employee =
            await createEmployeeRepository(
                client,
                {
                    ...employeeData,
                    user_id: user.id,
                    employee_code: employeeCode,
                    created_by: currentUser.id,
                }
            );

        // Optional domain/course mapping supplied by the admin employee form.
        // Each active mapping makes this counsellor eligible for auto-routing.
        if (Array.isArray(employeeData.routing_assignments)) {
            for (const routing of employeeData.routing_assignments) {
                if (!routing?.domain_id) continue;
                await createRoutingAssignmentRepository(client, {
                    employeeId: employee.id,
                    domainId: routing.domain_id,
                    courseId: routing.course_id || null,
                    autoAssign: routing.auto_assign !== false,
                });
            }
        }

        // Audit Log
        safeAuditLog({
            action: "EMPLOYEE_CREATED",
            module: "EMPLOYEE",
            userId: currentUser.id,
            role: currentUser.role,
            entityId: employee.id,
            requestId: req.requestId,
            ip: req.ip,
        });

        return employee;
    });

};

/* =====================================================
 * Update Employee
 * ===================================================== */

export const updateEmployeeService = async (
    id,
    employeeData,
    currentUser,
    req
) => {

    // Normalize Data
    if (employeeData.email) {
        employeeData.email =
            employeeData.email.trim().toLowerCase();
    }

    if (employeeData.full_name) {
        employeeData.full_name =
            employeeData.full_name.trim();
    }

    if (employeeData.mobile) {
        employeeData.mobile =
            employeeData.mobile.trim();
    }

    return await withTransaction(async (client) => {

        // Employee Exists
        const employee =
            await findEmployeeByIdRepository(id);

        if (!employee) {
            throw new ApiError(
                404,
                "Employee not found."
            );
        }

        // Duplicate Email Check
        if (employeeData.email) {

            const existingEmail =
                await findEmployeeByEmailRepository(
                    employeeData.email
                );

            if (
                existingEmail &&
                existingEmail.id !== Number(id)
            ) {
                throw new ApiError(
                    409,
                    "Employee email already exists."
                );
            }
        }

        // Duplicate Mobile Check
        if (employeeData.mobile) {

            const existingMobile =
                await findEmployeeByMobileRepository(
                    employeeData.mobile
                );

            if (
                existingMobile &&
                existingMobile.id !== Number(id)
            ) {
                throw new ApiError(
                    409,
                    "Mobile number already exists."
                );
            }
        }

        // Role Validation
        if (
            employeeData.role &&
            !isValidRole(employeeData.role)
        ) {
            throw new ApiError(
                400,
                "Invalid employee role."
            );
        }

        // Update Employee
        const updatedEmployee =
            await updateEmployeeRepository(
                client,
                id,
                {
                    ...employeeData,
                    updated_by: currentUser.id,
                }
            );

        // Update User
        await updateUserRepository(
            client,
            employee.user_id,
            {
                full_name:
                    employeeData.full_name ??
                    employee.full_name,

                role:
                    employeeData.role ??
                    employee.role,
            }
        );

        safeAuditLog({
            action: "EMPLOYEE_UPDATED",
            module: "EMPLOYEE",
            userId: currentUser.id,
            role: currentUser.role,
            entityId: id,
            requestId: req.requestId,
            ip: req.ip,
        });

        return updatedEmployee;

    });

};

/* =====================================================
 * Delete Employee
 * ===================================================== */

export const deleteEmployeeService = async (
    id,
    currentUser,
    req
) => {

    return await withTransaction(async (client) => {

        const employee =
            await findEmployeeByIdRepository(id);

        if (!employee) {

            throw new ApiError(
                404,
                "Employee not found."
            );

        }

        const deletedEmployee =
            await deleteEmployeeRepository(
                client,
                id,
                currentUser.id
            );

        await softDeleteUserRepository(
            client,
            employee.user_id
        );

        safeAuditLog({
            action: "EMPLOYEE_DELETED",
            module: "EMPLOYEE",
            userId: currentUser.id,
            role: currentUser.role,
            entityId: id,
            requestId: req.requestId,
            ip: req.ip,
        });

        return deletedEmployee;

    });

};

/* =====================================================
 * Restore Employee
 * ===================================================== */

export const restoreEmployeeService = async (
    id,
    currentUser,
    req
) => {

    return await withTransaction(async (client) => {

        const employee =
            await restoreEmployeeRepository(
                client,
                id,
                currentUser.id
            );

        // FIXED BUG
        if (!employee) {

            throw new ApiError(
                404,
                "Employee not found."
            );

        }

        await restoreUserRepository(
            client,
            employee.user_id
        );

        safeAuditLog({
            action: "EMPLOYEE_RESTORED",
            module: "EMPLOYEE",
            userId: currentUser.id,
            role: currentUser.role,
            entityId: id,
            requestId: req.requestId,
            ip: req.ip,
        });

        return employee;

    });

};

/**
 * =====================================================
 * Get All Employees
 * =====================================================
 */

export const getAllEmployeesService = async (filters = {}) => {

    return await getEmployeesRepository(filters);

};

/**
 * =====================================================
 * Get Employee By ID
 * =====================================================
 */

export const getEmployeeByIdService = async (
    id,
    currentUser
) => {

    const employee =
        await findEmployeeByIdRepository(id);

    if (!employee) {

        throw new ApiError(
            404,
            "Employee not found."
        );

    }

    // COUNSELLOR can only view their own profile
    if (
        currentUser.role === "COUNSELLOR" &&
        employee.user_id !== currentUser.id
    ) {

        throw new ApiError(
            403,
            "You are not authorized to view this employee."
        );

    }

    return employee;

};

/**
 * =====================================================
 * Get Employee Statistics
 * =====================================================
 */

export const getEmployeeStatisticsService = async () => {

    return await getEmployeeStatisticsRepository();

};

/**
 * =====================================================
 * Get My Leads Service
 * =====================================================
 */

export const getMyLeadsService = async (
  userId,
  filters
) => {

  // ==========================
  // Find Employee
  // ==========================

  const employee =
    await findEmployeeByUserIdRepository(userId);

  if (!employee) {

    throw new Error(
      "Employee profile not found."
    );

  }

  // ==========================
  // Get Leads
  // ==========================

  return await getMyLeadsRepository({

    employeeId: employee.id,

    ...filters,

  });

};

export const getEmployeePerformanceService = async (id) => {
    const employee = await findEmployeeByIdRepository(id);
    if (!employee) throw new ApiError(404, "Employee not found.");
    return { employee, ...(await getEmployeePerformanceRepository(id)) };
};
