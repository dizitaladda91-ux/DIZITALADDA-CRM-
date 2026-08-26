import axiosInstance from "../api/axiosInstance";

/**
 * Fetch Admissions with filters & metrics
 */
export const getAdmissions = async (params = {}) => {
  const response = await axiosInstance.get("/admissions", { params });
  return response.data;
};

/**
 * Collect Fee Installment for an Admission
 */
export const collectFee = async (admissionId, payload) => {
  const response = await axiosInstance.patch(`/admissions/${admissionId}/fee`, payload);
  return response.data;
};

/**
 * Create a new Admission
 */
export const createAdmission = async (payload) => {
  const response = await axiosInstance.post("/admissions", payload);
  return response.data;
};
