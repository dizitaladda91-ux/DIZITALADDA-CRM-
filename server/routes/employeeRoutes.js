import { Router } from "express";

import {
  createEmployeeController,
  getAllEmployeesController,
  getEmployeeByIdController,
  updateEmployeeController,
  deleteEmployeeController,
  restoreEmployeeController,
  getEmployeeStatisticsController,
  getEmployeePerformanceController,
  getMyPerformanceController,
  getMyLeadsController,
} from "../controllers/employeeController.js";

import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorize.js";
import PERMISSIONS from "../constants/permissions.js";

import {
  validateCreateEmployee,
  validateUpdateEmployee,
  validateEmployeeId,
  validateEmployeeFilters,
} from "../validators/employee.validator.js";

const router = Router();

/**
 * =====================================================
 * Static Routes (Must be defined BEFORE /:id dynamic routes)
 * =====================================================
 */
router.get(
  "/my-leads",
  authenticate,
  getMyLeadsController
);

router.get(
  "/my-performance",
  authenticate,
  getMyPerformanceController
);

router.get(
  "/statistics",
  authenticate,
  authorize(PERMISSIONS.VIEW_EMPLOYEE),
  getEmployeeStatisticsController
);

/**
 * =====================================================
 * Employee CRUD & Dynamic Parameterized Routes
 * =====================================================
 */
router.post(
  "/",
  authenticate,
  authorize(PERMISSIONS.CREATE_EMPLOYEE),
  validateCreateEmployee,
  createEmployeeController
);

router.get(
  "/",
  authenticate,
  authorize(PERMISSIONS.VIEW_EMPLOYEE),
  validateEmployeeFilters,
  getAllEmployeesController
);

router.get(
  "/:id/performance",
  authenticate,
  authorize(PERMISSIONS.VIEW_EMPLOYEE),
  validateEmployeeId,
  getEmployeePerformanceController
);

router.get(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.VIEW_EMPLOYEE),
  validateEmployeeId,
  getEmployeeByIdController
);

router.put(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.UPDATE_EMPLOYEE),
  validateEmployeeId,
  validateUpdateEmployee,
  updateEmployeeController
);

router.delete(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.DELETE_EMPLOYEE),
  validateEmployeeId,
  deleteEmployeeController
);

router.patch(
  "/:id/restore",
  authenticate,
  authorize(PERMISSIONS.RESTORE_EMPLOYEE),
  validateEmployeeId,
  restoreEmployeeController
);

export default router;
