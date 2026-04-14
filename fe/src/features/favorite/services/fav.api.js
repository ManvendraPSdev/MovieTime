import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/fav",
  withCredentials: true,
});

export const addFavorite = async (data) => {
  try {
    const res = await api.post("/", data);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getFavorites = async () => {
  try {
    const res = await api.get("/");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const checkFavorite = async (tmdbId, type = "movie") => {
  try {
    const res = await api.get(`/tmdb/${tmdbId}`, {
      params: { type },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const removeFavorite = async (tmdbId, type = "movie") => {
  try {
    const res = await api.delete(`/${tmdbId}`, {
      params: { type },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};