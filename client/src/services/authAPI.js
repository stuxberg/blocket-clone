import api from "../api/client";

export const loginApi = async (formData) => {
  const response = await api.post("/auth/login", formData);
  return response.data;
};
