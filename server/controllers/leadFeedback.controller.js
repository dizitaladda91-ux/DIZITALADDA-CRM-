import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  addLeadFeedbackService,
  getLeadFeedbackHistoryService,
} from "../services/leadFeedback.service.js";

/**
 * Add a new feedback entry for a lead
 * @route POST /api/leads/:id/feedback
 */
export const addLeadFeedback = asyncHandler(async (req, res) => {
  const result = await addLeadFeedbackService(
    req.params.id,
    req.body,
    req.user,
    req
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      result,
      "Lead feedback added successfully."
    )
  );
});

/**
 * Get feedback history for a lead
 * @route GET /api/leads/:id/feedback
 */
export const getLeadFeedbackHistory = asyncHandler(async (req, res) => {
  const history = await getLeadFeedbackHistoryService(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      history,
      "Lead feedback history fetched successfully."
    )
  );
});
