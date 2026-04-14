import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/movie",
  withCredentials: true,
});

export const fetchMovies = async (params = {}) => {
  try {
    const res = await api.get("/", { params });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchMovieById = async (id) => {
  try {
    const res = await api.get(`/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchMovieByTmdbId = async (tmdbId) => {
  try {
    const res = await api.get(`/tmdb/${tmdbId}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createMovie = async (data) => {
  try {
    const res = await api.post("/", data);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateMovie = async (id, data) => {
  try {
    const res = await api.put(`/${id}`, data);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteMovie = async (id) => {
  try {
    const res = await api.delete(`/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};