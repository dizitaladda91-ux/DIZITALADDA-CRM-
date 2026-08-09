import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import crypto from "crypto";

import ApiError from "../utils/ApiError.js";

import ROLES from "../constants/roles.js";

import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.js";

import {
  createPasswordResetRepository,
  findPasswordResetRepository,
  markPasswordResetUsedRepository,
  deleteUserPasswordResetRepository,
} from "../repositories/passwordResetRepository.js";

import {
  deleteAllRefreshTokensRepository,
} from "../repositories/refreshTokenRepository.js";

import {
  findRefreshTokenRepository,
  createRefreshTokenRepository,
  deleteRefreshTokenRepository,
} from "../repositories/refreshTokenRepository.js";


import {
  createUserRepository,
  findUserByEmailRepository,
  findUserByEmailWithPasswordRepository,
  updateLastLoginRepository,
  findUserByIdRepository,
  updatePasswordRepository,
  updateEmailVerificationRepository,
  updateOwnProfileRepository,
} from "../repositories/authRepository.js";

import auditLogger from "../utils/auditLogger.js";
import { verifyStoredPassword } from "../utils/passwordUtils.js";

/**
 * =====================================================
 * Register User
 *
 * SECURITY FIX (see audit notes):
 * This previously spread the entire client-supplied
 * request body - including an attacker-controlled `role`
 * field - directly into the users INSERT. That allowed
 * unauthenticated self-registration as ADMIN via
 * POST /auth/register with { role: "ADMIN" } in the body.
 * Role is now force-set to ROLES.COUNSELLOR, ignoring
 * anything the client sends, regardless of what
 * registerValidator does or doesn't check.
 *
 * PRODUCT NOTE: given every other file reviewed this
 * session shows an admin-provisioned-only account model
 * (employeeService.js creates linked users+employees
 * rows together, with employee_code/department/etc.), a
 * self-registered user via this endpoint will have no
 * linked `employees` row and will hit "No employee
 * profile linked to this account" errors on most
 * counsellor-facing actions. Consider whether public
 * registration should be exposed at all, versus admin-
 * only provisioning via POST /api/employees. Left enabled
 * here with a safe role default rather than removed
 * outright, since that's a product decision, not a
 * security one - but flagging it strongly.
 * =====================================================
 */
export const registerUserService = async (
  userData
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const existingUser =
      await findUserByEmailRepository(
        userData.email
      );

    if (existingUser) {

      throw new ApiError(
        409,
        "Email already exists."
      );

    }

    const hashedPassword =
      await bcrypt.hash(
        userData.password,
        10
      );

    const user =
      await createUserRepository(
        client,
        {
          full_name: userData.full_name,
          email: userData.email,
          password: hashedPassword,
          role: ROLES.COUNSELLOR,
        }
      );

    auditLogger({
      action: "USER_REGISTERED",
      module: "AUTH",
      userId: user.id,
      role: user.role,
      entityId: user.id,
    });

    await client.query("COMMIT");

    return user;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};

/**
 * =====================================================
 * Login User
 *
 * SECURITY FIX (see audit notes):
 * Removed console.log statements that printed the
 * user's email, role, stored password hash, and the
 * plaintext password they typed on every login attempt.
 * This leaked credential material directly into server
 * logs - anyone with log access could harvest password
 * hashes and observe real plaintext passwords typed by
 * users. The plain-text-password upgrade logic itself is
 * unchanged and legitimate; only the logging was removed.
 * =====================================================
 */
export const loginUserService = async (
  email,
  password
) => {

  const user =
    await findUserByEmailWithPasswordRepository(
      email
    );

  if (!user) {

    throw new ApiError(
      401,
      "Invalid email or password."
    );

  }

  const isPasswordPlainText =
    typeof user.password === "string" &&
    !user.password.startsWith("$2");

  const isPasswordCorrect = await verifyStoredPassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(
      401,
      "Invalid email or password."
    );
  }

  if (isPasswordPlainText) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const hashedPassword = await bcrypt.hash(password, 10);
      await updatePasswordRepository(
        client,
        user.id,
        hashedPassword
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      // Intentionally not logging error details here beyond
      // this point - see audit notes on removed debug logging.
      // A structured logger.error(error) without credential
      // material would be the right long-term replacement.
    } finally {
      client.release();
    }
  }

  await updateLastLoginRepository(user.id);

  const accessToken = generateAccessToken(user);

  const refreshToken = generateRefreshToken(user);

  delete user.password;

  auditLogger({
    action: "USER_LOGIN",
    module: "AUTH",
    userId: user.id,
    role: user.role,
    entityId: user.id,
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};
/**
 * =====================================================
 * Get Profile
 * =====================================================
 */
export const getProfileService = async (
  userId
) => {

  const user =
    await findUserByIdRepository(userId);

  if (!user) {

    throw new ApiError(
      404,
      "User not found."
    );

  }

  if (user.is_deleted) {

    throw new ApiError(
      403,
      "User account has been deleted."
    );

  }

  if (!user.is_active) {

    throw new ApiError(
      403,
      "User account is inactive."
    );

  }

  return user;

};

/**
 * =====================================================
 * Change Password
 * =====================================================
 */
export const changePasswordService = async (
  userId,
  currentPassword,
  newPassword
) => {

  const client =
    await pool.connect();

  try {

    await client.query("BEGIN");

    const user =
      await findUserByIdRepository(userId);

    if (!user) {

      throw new ApiError(
        404,
        "User not found."
      );

    }

    const loginUser =
      await findUserByEmailWithPasswordRepository(
        user.email
      );

    const isPasswordCorrect = await verifyStoredPassword(
      currentPassword,
      loginUser.password
    );

    if (!isPasswordCorrect) {

      throw new ApiError(
        401,
        "Current password is incorrect."
      );

    }

    const isSamePassword = await verifyStoredPassword(
      newPassword,
      loginUser.password
    );

    if (isSamePassword) {

      throw new ApiError(
        400,
        "New password cannot be the same as the current password."
      );

    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    const updatedUser =
      await updatePasswordRepository(
        client,
        userId,
        hashedPassword
      );

    auditLogger({
      action: "PASSWORD_CHANGED",
      module: "AUTH",
      userId: userId,
      role: user.role,
      entityId: userId,
    });

    await client.query("COMMIT");

    return updatedUser;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};

/**
 * =====================================================
 * Forgot Password
 *
 * SECURITY FIX (see audit notes) - CRITICAL:
 * This previously returned the raw, usable reset token
 * directly in the function's return value, which the
 * controller then sent straight back in the HTTP
 * response body. Since no email-delivery mechanism
 * exists anywhere in this codebase, that meant the token
 * was never actually sent to the account owner via a
 * side channel - it was handed directly to whoever called
 * this endpoint. Anyone who knew any user's email address
 * (including an admin's) could call this endpoint, receive
 * a valid reset token in the response, and immediately use
 * it to take over that account with no authentication at
 * all.
 *
 * The token is now only returned when NODE_ENV is not
 * "production", strictly for local development/testing
 * where no real email service is wired up yet. In any
 * other environment, only the generic message is returned.
 *
 * THIS IS A STOPGAP, NOT A FIX. The real fix is building
 * an actual email-delivery mechanism (flagged elsewhere in
 * this audit as a missing module entirely) and sending the
 * token there instead of returning it at all, in any
 * environment. Treat this as a P0 build item, not just a
 * P0 patch - do not rely on the NODE_ENV gate alone in a
 * real deployment.
 * =====================================================
 */
export const forgotPasswordService = async (
  email
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const user =
      await findUserByEmailRepository(email);

    /**
     * Security:
     * Never reveal whether the email exists.
     */

    if (!user) {

      await client.query("COMMIT");

      return {
        message:
          "If an account exists, a password reset link has been sent."
      };

    }

    await deleteUserPasswordResetRepository(
      client,
      user.id
    );

    const plainToken =
      crypto.randomBytes(32).toString("hex");

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(plainToken)
        .digest("hex");

    const expiresAt =
      new Date(
        Date.now() + 15 * 60 * 1000
      );

    await createPasswordResetRepository(

      client,

      user.id,

      hashedToken,

      expiresAt

    );

    auditLogger({
      action: "PASSWORD_RESET_REQUESTED",
      module: "AUTH",
      userId: user.id,
      role: user.role,
      entityId: user.id,
    });

    await client.query("COMMIT");

    // TODO (P0 - see audit notes): send `plainToken` via a
    // real email-delivery service instead of ever returning
    // it in an API response, in every environment.
    if (process.env.NODE_ENV !== "production") {

      return {
        message:
          "If an account exists, a password reset link has been sent.",
        // Development-only - never returned in production.
        resetToken: plainToken,
        expiresAt,
      };

    }

    return {
      message:
        "If an account exists, a password reset link has been sent.",
    };

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};

/**
 * =====================================================
 * Reset Password
 * =====================================================
 */
export const resetPasswordService = async (

  token,

  newPassword

) => {

  const client =
    await pool.connect();

  try {

    await client.query("BEGIN");

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const reset =
      await findPasswordResetRepository(
        hashedToken
      );

    if (!reset) {

      throw new ApiError(
        400,
        "Invalid reset token."
      );

    }

    if (
      new Date(reset.expires_at) <
      new Date()
    ) {

      throw new ApiError(
        400,
        "Reset token has expired."
      );

    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    await updatePasswordRepository(

      client,

      reset.user_id,

      hashedPassword

    );

    await markPasswordResetUsedRepository(

      client,

      reset.id

    );

    await deleteAllRefreshTokensRepository(

      client,

      reset.user_id

    );

    auditLogger({
      action: "PASSWORD_RESET_COMPLETED",
      module: "AUTH",
      userId: reset.user_id,
      role: null,
      entityId: reset.user_id,
    });

    await client.query("COMMIT");

    return {

      success: true,

      message:
        "Password reset successfully.",

    };

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};

/**
 * =====================================================
 * Logout User
 * =====================================================
 */
export const logoutUserService = async (
  refreshToken,
  client
) => {

  const token =
    await findRefreshTokenRepository(
      refreshToken
    );

  if (!token) {

    return {
      success: true,
      message: "User logged out successfully.",
    };

  }

  await deleteRefreshTokenRepository(
    client,
    refreshToken
  );

  return {

    success: true,

    message: "User logged out successfully.",

  };

};

/**
 * =====================================================
 * Refresh Token Rotation
 * =====================================================
 */
export const refreshTokenRotationService =
async (
  refreshToken,
  client
) => {

  const storedToken =
    await findRefreshTokenRepository(
      refreshToken
    );

  if (!storedToken) {

    throw new ApiError(
      401,
      "Invalid refresh token."
    );

  }

  const decoded =
    verifyRefreshToken(
      refreshToken
    );

  const user =
    await findUserByIdRepository(
      decoded.id
    );

  if (!user) {

    throw new ApiError(
      401,
      "User not found."
    );

  }

  await deleteRefreshTokenRepository(
    client,
    refreshToken
  );

  const newAccessToken =
    generateAccessToken(user);

  const newRefreshToken =
    generateRefreshToken(user);

  const expiresAt =
    new Date(
      Date.now() +
      7 * 24 * 60 * 60 * 1000
    );

  await createRefreshTokenRepository(

    client,

    user.id,

    newRefreshToken,

    expiresAt

  );

  return {

    accessToken:
      newAccessToken,

    refreshToken:
      newRefreshToken,

  };

};

/**
 * =====================================================
 * Verify Email
 * =====================================================
 */
export const verifyEmailService =
async (
  client,
  userId
) => {

  const user =
    await findUserByIdRepository(
      userId
    );

  if (!user) {

    throw new ApiError(
      404,
      "User not found."
    );

  }

  if (user.email_verified) {

    return {

      success: true,

      message:
        "Email already verified.",

    };

  }

  await updateEmailVerificationRepository(

    client,

    userId

  );

  return {

    success: true,

    message:
      "Email verified successfully.",

  };

};

export const updateOwnProfileService = async (userId, profile) => {
  const user = await updateOwnProfileRepository(userId, {
    full_name: profile.full_name.trim(),
    profile_image: profile.profile_image || null,
  });

  if (!user) throw new ApiError(404, "User not found.");

  return user;
};