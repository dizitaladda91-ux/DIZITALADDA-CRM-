import axiosInstance from "../api/axiosInstance";

/**
 * Add a new feedback entry for a lead
 */
export const addLeadFeedback = async (leadId, data) => {
  const response = await axiosInstance.post(`/leads/${leadId}/feedback`, data);
  return response.data;
};

/**
 * Get feedback history for a lead
 */
export const getLeadFeedbackHistory = async (leadId) => {
  const response = await axiosInstance.get(`/leads/${leadId}/feedback`);
  return response.data;
};
