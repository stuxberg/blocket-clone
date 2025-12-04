import api from "../api/client";

export const createListing = async (formData) => {
  const response = await api.post("/listings/create", formData);
  return response.data;
};

export const getListings = async () => {
  const response = await api.get("/listings");
  return response.data;
};

export const getListing = async (id) => {
  const response = await api.get(`/listings/${id}`);
  return response.data;
};
