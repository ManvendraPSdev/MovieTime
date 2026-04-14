import { useCallback, useContext } from "react";
import { MovieContext } from "../movie.context";
import {
  createMovie,
  fetchMovieById,
  fetchMovieByTmdbId,
  fetchMovies,
  updateMovie,
  deleteMovie,
} from "../services/movie.api";

export const useMovie = () => {
  const context = useContext(MovieContext);
  const {
    loading,
    setLoading,
    movie,
    setMovie,
    movies,
    setMovies,
    error,
    setError,
  } = context;

  const getMovies = useCallback(async (params = {}, options = {}) => {
    const { append = false } = options;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMovies(params);
      const nextMovies = Array.isArray(data?.movies) ? data.movies : [];
      if (append) {
        setMovies((prev) => {
          const seen = new Set(prev.map((item) => item._id));
          const fresh = nextMovies.filter((item) => !seen.has(item._id));
          return [...prev, ...fresh];
        });
      } else {
        setMovies(nextMovies);
      }
      return data;
    } catch (error) {
      setError(error.message || "Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, setMovies]);

  const getMovie = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMovieById(id);
      setMovie(data);
      return data;
    } catch (error) {
      setError(error.message || "Failed to fetch movie");
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, setMovie]);

  const getMovieByTmdb = useCallback(async (tmdbId) => {
    try {
      const data = await fetchMovieByTmdbId(tmdbId);
      return data;
    } catch {
      return null;
    }
  }, []);

  const addMovie = useCallback(async (movieData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createMovie(movieData);
      setMovies((prev) => [data.movie, ...prev]);
    } catch (error) {
      setError(error.message || "Failed to create movie");
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, setMovies]);

  const editMovie = useCallback(async (id, movieData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateMovie(id, movieData);
      setMovies((prev) =>
        prev.map((m) => (m._id === id ? data.movie : m))
      );
    } catch (err) {
      setError(err.message || "Failed to update movie");
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, setMovies]);

  const removeMovie = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteMovie(id);
      setMovies((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete movie");
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, setMovies]);

  return {
    loading,
    movies,
    movie,
    error,
    getMovies,
    getMovie,
    getMovieByTmdb,
    addMovie,
    editMovie,
    removeMovie,
  };
};