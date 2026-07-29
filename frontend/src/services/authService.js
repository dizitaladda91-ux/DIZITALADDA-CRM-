import axiosInstance from "../api/axiosInstance";

export const loginUser = async (credentials) => {

  const response = await axiosInstance.post(

    "/auth/login",

    credentials

  );

  return response.data;

};

export const getProfile = async () => {

  const response = await axiosInstance.get(

    "/auth/me"

  );

  return response.data;

};

export const changePassword = async (payload) => {

    const response = await axiosInstance.put(

        "/auth/change-password",

        payload

    );

    return response.data;

};

export const updateProfile = async (payload) => {
  const response = await axiosInstance.patch("/auth/profile", payload);
  return response.data;
};
