import ApiError from "../utils/ApiError.js";

import { HTTP_STATUS } from "../constants/httpStatus.js";

import {
  verifyAccessToken,
} from "../utils/jwt.js";

import {
  findUserByIdRepository,
} from "../repositories/authRepository.js";

import {
  findEmployeeByUserIdRepository,
} from "../repositories/employeeRepository.js";

/**
 * =====================================================
 * Authentication Middleware
 * Project : IEM Admissions CRM
 * =====================================================
 */

const authMiddleware = async (
  req,
  res,
  next
) => {

  try {

    /**
     * ----------------------------------------
     * Authorization Header
     * ----------------------------------------
     */

    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {

      return next(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          "Authorization token is required."
        )
      );

    }

    /**
     * ----------------------------------------
     * Extract Token
     * ----------------------------------------
     */

    const token =
      authHeader.split(" ")[1];

    if (!token) {

      return next(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          "Authentication token is missing."
        )
      );

    }

    /**
     * ----------------------------------------
     * Verify JWT
     * ----------------------------------------
     */

    const decoded =
      verifyAccessToken(token);

    /**
     * ----------------------------------------
     * Check User Exists
     * ----------------------------------------
     */

    const user =
      await findUserByIdRepository(
        decoded.id
      );

    if (!user) {

      return next(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          "User not found."
        )
      );

    }

    /**
     * ----------------------------------------
     * Check Account Is Active
     * (Prevents deactivated users from
     * continuing to use an already-issued,
     * still-unexpired access token)
     * ----------------------------------------
     */

    if (!user.is_active) {

      return next(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          "Your account has been deactivated. Please contact an administrator."
        )
      );

    }

    /**
     * ----------------------------------------
     * Check Account Is Not Deleted
     * (findUserByIdRepository already filters
     * is_deleted = FALSE at the query level,
     * so this branch should be unreachable in
     * normal operation. It stays here as an
     * explicit, self-documenting guard so the
     * security boundary is visible in this file
     * without having to trace into the
     * repository layer, and so behavior stays
     * correct even if the repository query is
     * ever changed to drop that filter.)
     * ----------------------------------------
     */

    if (user.is_deleted) {

      return next(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          "This account no longer exists."
        )
      );

    }

    /**
     * ----------------------------------------
     * Attach Safe User Object
     * ----------------------------------------
     */

    req.user = {

      id: user.id,

      full_name: user.full_name,

      email: user.email,

      role: user.role,

    };

    next();

  } catch (error) {

    /**
     * ----------------------------------------
     * Token Expired
     * ----------------------------------------
     */

    if (
      error.name ===
      "TokenExpiredError"
    ) {

      return next(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          "Token has expired."
        )
      );

    }

    /**
     * ----------------------------------------
     * Invalid JWT
     * ----------------------------------------
     */

    if (
      error.name ===
      "JsonWebTokenError"
    ) {

      return next(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          "Invalid authentication token."
        )
      );

    }

    /**
     * ----------------------------------------
     * Unknown Error
     * ----------------------------------------
     */

    return next(error);

  }

};

export default authMiddleware;