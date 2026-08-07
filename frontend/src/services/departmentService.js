import axiosInstance from "../api/axiosInstance";

export const getDepartments = async () => (await axiosInstance.get("/departments")).data;
