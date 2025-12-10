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

export const getFavorites = async () => {
  const response = await api.get("/listings/favorites");
  return response.data;
};

export const addFavorite = async (id) => {
  const response = await api.post(`/listings/${id}/like`);
  return response.data;
};

export const removeFavorite = async (id) => {
  const response = await api.delete(`/listings/${id}/like`);
  return response.data;
};

export const getMyListings = async () => {
  const response = await api.get("/listings/my-listings");
  return response.data;
};
