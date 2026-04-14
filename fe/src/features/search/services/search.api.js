import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

const tmdb = axios.create({
  baseURL: BASE_URL,
});

export const searchMulti = async (query) => {
  const res = await tmdb.get("/search/multi", {
    params: {
      api_key: API_KEY,
      query,
    },
  });
  return res.data;
};
