import { useMemo } from "react";
import * as tmdbApi from "../services/tmdb.api";

export const useTmdbApi = () => {
  return useMemo(() => tmdbApi, []);
};
