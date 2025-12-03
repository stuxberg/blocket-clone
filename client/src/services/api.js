import api from "../api/users";

export const loginApi = async (formData) => {
  const response = await api.post("/login", formData);
  return response.data;
};
