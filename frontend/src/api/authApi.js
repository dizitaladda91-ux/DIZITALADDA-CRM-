import api from "./axiosInstance";

export const loginApi = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const getProfileApi = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};