import axiosInstance from "../api/axiosInstance";

export const fetchLeadSources = async () => (await axiosInstance.get("/lead-sources")).data?.data || [];
export const createLeadSource = async (payload) => (await axiosInstance.post("/lead-sources", payload)).data?.data;
