import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getRoleNotificationsService } from "../services/notification.service.js";

/**
 * Get Notifications for Logged-In User (Admin / Counsellor)
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const result = await getRoleNotificationsService(req.user);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Notifications fetched successfully."
      )
    );
});
