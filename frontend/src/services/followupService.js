import axiosInstance from "../api/axiosInstance";

export const getFollowups = async (params = {}) => (await axiosInstance.get("/followups", { params })).data;
export const completeFollowup = async (id, payload) => (await axiosInstance.patch(`/followups/${id}/complete`, payload)).data;
