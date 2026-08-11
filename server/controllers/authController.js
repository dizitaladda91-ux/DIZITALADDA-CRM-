import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import {
  registerUserService,
  loginUserService,
} from "../services/authService.js";

import {
  getProfileService,
  updateOwnProfileService,
  changePasswordService,
} from "../services/authService.js";

import {
  forgotPasswordService,
  resetPasswordService,
} from "../services/authService.js";

import {
  refreshTokenRotationService,
  logoutUserService,
  verifyEmailService,
} from "../services/authService.js";

import pool from "../config/db.js";
import ms from "ms"; // npm install ms — small dep, also a transitive dep of jsonwebtoken already

/**
 * =====================================================
 * Cookie config (P0-1: token storage migration)
 *
 * Cross-site setup (Vercel frontend, Render backend) requires
 * sameSite: "none" + secure: true — browsers reject sameSite:
 * "none" without secure. No `domain` attribute is set; that's
 * only needed for sharing a cookie across subdomains of the
 * SAME site, which doesn't apply here.
 *
 * Both max-ages are DERIVED from the exact same env vars
 * utils/jwt.js uses (JWT_EXPIRES_IN / JWT_REFRESH_EXPIRES_IN),
 * via the `ms` package, so the cookie lifetime can never drift
 * out of sync with the actual JWT lifetime even if those env
 * vars change later.
 *
 * NOTE: the DB-side refresh token expiry (in loginUserService
 * and refreshTokenRotationService, in services/authService.js)
 * is currently hardcoded to 7 days rather than reading
 * JWT_REFRESH_EXPIRES_IN. That's a pre-existing inconsistency,
 * separate from this cookie change — flagging it, not fixing it
 * here to keep this patch scoped to cookie storage. Worth a
 * follow-up if you ever change JWT_REFRESH_EXPIRES_IN from 7d.
 * =====================================================
 */
const ACCESS_TOKEN_MAX_AGE_MS = ms(process.env.JWT_EXPIRES_IN || "1d");
const REFRESH_TOKEN_MAX_AGE_MS = ms(process.env.JWT_REFRESH_EXPIRES_IN || "7d");

const baseCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

const setAuthCookies = (res, accessToken, refreshToken) => {

  res.cookie("accessToken", accessToken, {
    ...baseCookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE_MS,
    path: "/",
  });

  res.cookie("refreshToken", refreshToken, {
    ...baseCookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    // Scoped narrower than the access token cookie — the refresh
    // token only ever needs to be sent to auth endpoints, not every
    // API call, so it's not exposed to routes that don't need it.
    path: "/api/auth",
  });

};

const clearAuthCookies = (res) => {

  res.clearCookie("accessToken", { ...baseCookieOptions, path: "/" });
  res.clearCookie("refreshToken", { ...baseCookieOptions, path: "/api/auth" });

};

/**
 * =====================================================
 * Register User
 * =====================================================
 */
export const register = asyncHandler(
  async (req, res) => {

    const user =
      await registerUserService(
        req.body
      );

    return res.status(201).json(

      new ApiResponse(
        201,
        user,
        "User registered successfully."
      )

    );

  }
);

/**
 * =====================================================
 * Login User
 *
 * CHANGED (P0-1): accessToken/refreshToken are no longer
 * returned in the JSON body — they're set as httpOnly
 * cookies. Only the user object goes in the response body.
 * =====================================================
 */
export const login = asyncHandler(
  async (req, res) => {

    const {
      email,
      password,
    } = req.body;

    const result =
      await loginUserService(
        email,
        password
      );

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(200).json(

      new ApiResponse(
        200,
        { user: result.user },
        "Login successful."
      )

    );

  }
);

/**
 * =====================================================
 * Get Logged In User Profile
 * =====================================================
 */
export const getProfile = asyncHandler(
  async (req, res) => {

    const user =
      await getProfileService(
        req.user.id
      );

    return res.status(200).json(

      new ApiResponse(
        200,
        user,
        "Profile fetched successfully."
      )

    );

  }
);

/**
 * =====================================================
 * Change Password
 * =====================================================
 */
export const changePassword = asyncHandler(
  async (req, res) => {

    const {
      currentPassword,
      newPassword,
    } = req.body;

    const result =
      await changePasswordService(

        req.user.id,

        currentPassword,

        newPassword

      );

    return res.status(200).json(

      new ApiResponse(

        200,

        result,

        "Password changed successfully."

      )

    );

  }
);

/**
 * =====================================================
 * Forgot Password
 * =====================================================
 */
export const forgotPassword = asyncHandler(
  async (req, res) => {

    const { email } = req.body;

    const result =
      await forgotPasswordService(email);

    return res.status(200).json(

      new ApiResponse(

        200,

        result,

        "If the account exists, a password reset link has been sent."

      )

    );

  }
);

/**
 * =====================================================
 * Reset Password
 * =====================================================
 */
export const resetPassword = asyncHandler(
  async (req, res) => {

    const {
      token,
      newPassword,
    } = req.body;

    const result =
      await resetPasswordService(

        token,

        newPassword

      );

    return res.status(200).json(

      new ApiResponse(

        200,

        result,

        "Password reset successfully."

      )

    );

  }
);

/**
 * =====================================================
 * Refresh Access Token
 *
 * CHANGED (P0-1): refresh token now read from the httpOnly
 * cookie instead of req.body. New tokens are re-set as
 * cookies rather than returned in the body. Requires
 * cookie-parser middleware to be registered — see note
 * at bottom of this file.
 * =====================================================
 */
export const refreshToken = asyncHandler(
  async (req, res) => {

    const refreshTokenCookie = req.cookies?.refreshToken;

    if (!refreshTokenCookie) {

      throw new ApiError(401, "No refresh token provided.");

    }

    const client = await pool.connect();

    try {

      await client.query("BEGIN");

      const result =
        await refreshTokenRotationService(
          refreshTokenCookie,
          client
        );

      await client.query("COMMIT");

      setAuthCookies(res, result.accessToken, result.refreshToken);

      return res.status(200).json(

        new ApiResponse(

          200,

          { success: true },

          "Access token refreshed successfully."

        )

      );

    } catch (error) {

      await client.query("ROLLBACK");

      throw error;

    } finally {

      client.release();

    }

  }
);

/**
 * =====================================================
 * Logout User
 *
 * CHANGED (P0-1): refresh token read from cookie instead
 * of req.body. Cookies are cleared unconditionally — even
 * if there's no valid token to find/delete server-side,
 * the browser's cookies still need to go.
 * =====================================================
 */
export const logout = asyncHandler(
  async (req, res) => {

    const refreshTokenCookie = req.cookies?.refreshToken;

    const client = await pool.connect();

    try {

      await client.query("BEGIN");

      const result =
        await logoutUserService(
          refreshTokenCookie,
          client
        );

      await client.query("COMMIT");

      clearAuthCookies(res);

      return res.status(200).json(

        new ApiResponse(

          200,

          result,

          "Logout successful."

        )

      );

    } catch (error) {

      await client.query("ROLLBACK");

      throw error;

    } finally {

      client.release();

    }

  }
);

/**
 * =====================================================
 * Verify Email
 * =====================================================
 */
export const verifyEmail = asyncHandler(
  async (req, res) => {

    const client =
      await pool.connect();

    try {

      await client.query("BEGIN");

      const result =
        await verifyEmailService(

          client,

          req.user.id

        );

      await client.query("COMMIT");

      return res.status(200).json(

        new ApiResponse(

          200,

          result,

          "Email verified successfully."

        )

      );

    } catch (error) {

      await client.query("ROLLBACK");

      throw error;

    } finally {

      client.release();

    }

  }
);

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await updateOwnProfileService(req.user.id, req.body);
  return res.status(200).json(
    new ApiResponse(200, user, "Profile updated successfully.")
  );
});

/**
 * =====================================================
 * REQUIRED SETUP — not in this file, flagging so it's not
 * missed:
 *
 * 1. `cookie-parser` must be installed and registered in your
 *    app entrypoint (e.g. server/app.js), BEFORE routes:
 *
 *      import cookieParser from "cookie-parser";
 *      app.use(cookieParser());
 *
 * 2. Your CORS config needs `credentials: true` and an
 *    explicit origin (a wildcard "*" origin is rejected by
 *    browsers for credentialed/cookie requests):
 *
 *      import cors from "cors";
 *      app.use(cors({
 *        origin: process.env.CLIENT_URL, // e.g. your Vercel URL
 *        credentials: true,
 *      }));
 *
 * 3. Your auth middleware (wherever it currently reads
 *    "Authorization: Bearer <token>" from headers to populate
 *    req.user) needs to instead read req.cookies.accessToken.
 *    I don't have that file yet — send it and I'll patch it;
 *    without this change, every protected route still expects
 *    the old header and will reject valid cookie-based requests.
 * =====================================================
 */