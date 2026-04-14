import { useCallback, useContext } from "react";
import { FavContext } from "../fav.context";
import {
  addFavorite,
  getFavorites,
  checkFavorite,
  removeFavorite,
} from "../services/fav.api";

export const useFav = () => {
  const context = useContext(FavContext);

  const {
    loading,
    setLoading,
    favorites,
    setFavorites,
    error,
    setError,
  } = context;

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFavorites();
      setFavorites(data.favMovies || []);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch favorites");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setFavorites]);

  const addFav = useCallback(async (movieData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await addFavorite(movieData);

      setFavorites((prev) => {
        const exists = prev.find(
          (item) => item.tmdbId === movieData.tmdbId
        );
        if (exists) return prev;
        return [data.favMovie, ...prev];
      });

      return data;
    } catch (err) {
      setError(err.message || "Failed to add favorite");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setFavorites]);

  const removeFav = useCallback(async (tmdbId, type = "movie") => {
    setLoading(true);
    setError(null);
    try {
      await removeFavorite(tmdbId, type);

      setFavorites((prev) =>
        prev.filter((item) => item.tmdbId !== String(tmdbId))
      );
    } catch (err) {
      setError(err.message || "Failed to remove favorite");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setFavorites]);

  const isFavorite = useCallback(async (tmdbId, type = "movie") => {
    try {
      const data = await checkFavorite(tmdbId, type);
      return data.isFavorite;
    } catch {
      return false;
    }
  }, []);

  return {
    loading,
    favorites,
    error,
    fetchFavorites,
    addFav,
    removeFav,
    isFavorite,
  };
};