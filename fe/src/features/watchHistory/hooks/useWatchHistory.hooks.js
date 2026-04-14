import { useCallback, useContext } from "react";
import {

  addWatchHistory,
  getWatchHistory,
  clearWatchHistory,
} from "../services/watchHistory.api";
import { WatchHistoryContext } from "../watchHistory.context";

export const useWatchHistory = () => {
  const context = useContext(WatchHistoryContext);

  const {
    loading,
    setLoading,
    error,
    setError,
    watchHistory,
    setWatchHistory,
  } = context;

  const fetchHistory = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWatchHistory(params);
      setWatchHistory(data.history || []);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch watch history");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setWatchHistory]);


  const addHistory = useCallback(async (movieData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await addWatchHistory(movieData);

      // Add latest on top
      setWatchHistory((prev) => [data.entry, ...prev]);

      return data;
    } catch (err) {
      setError(err.message || "Failed to add to watch history");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setWatchHistory]);


  const clearHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await clearWatchHistory();
      setWatchHistory([]); // reset state
    } catch (err) {
      setError(err.message || "Failed to clear watch history");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setWatchHistory]);

  return {
    loading,
    error,
    watchHistory,
    fetchHistory,
    addHistory,
    clearHistory,
  };
};