import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

const tmdb = axios.create({
  baseURL: BASE_URL,
});


export const getTrending = async (type = "movie", time = "day") => {
  const res = await tmdb.get(`/trending/${type}/${time}`, {
    params: { api_key: API_KEY },
  });
  return res.data;
};


export const getPopular = async (type = "movie", page = 1) => {
  const res = await tmdb.get(`/${type}/popular`, {
    params: { api_key: API_KEY, page },
  });
  return res.data;
};


export const getDiscover = async (type = "movie", page = 1, genreId = "") => {
  const res = await tmdb.get(`/discover/${type}`, {
    params: {
      api_key: API_KEY,
      page,
      with_genres: genreId || undefined,
    },
  });
  return res.data;
};


export const getDetails = async (type, id) => {
  const res = await tmdb.get(`/${type}/${id}`, {
    params: { api_key: API_KEY },
  });
  return res.data;
};


export const getGenres = async (type = "movie") => {
  const res = await tmdb.get(`/genre/${type}/list`, {
    params: { api_key: API_KEY },
  });
  return res.data.genres;
};


export const getTrendingPeople = async () => {
  const res = await tmdb.get(`/trending/person/day`, {
    params: { api_key: API_KEY },
  });
  return res.data;
};

export const getVideos = async (type, id) => {
  const res = await tmdb.get(`/${type}/${id}/videos`, {
    params: { api_key: API_KEY },
  });
  return res.data;
};

export const getCredits = async (type, id) => {
  const res = await tmdb.get(`/${type}/${id}/credits`, {
    params: { api_key: API_KEY },
  });
  return res.data;
};