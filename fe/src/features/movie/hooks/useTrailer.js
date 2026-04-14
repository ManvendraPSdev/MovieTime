import { useState } from "react";
import { getVideos } from "../services/tmdb.api";

export const useTrailer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trailerKey, setTrailerKey] = useState("");
  const [message, setMessage] = useState("");

  const fetchTrailer = async (type, id) => {
    if (!id) {
      setTrailerKey("");
      setMessage("Trailer for this movie is currently unavailable.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage("");
    try {
      const data = await getVideos(type, id);
      const videos = Array.isArray(data?.results) ? data.results : [];

      const preferred = videos.find(
        (video) => video.site === "YouTube" && video.type === "Trailer"
      );
      const fallback = videos.find((video) => video.site === "YouTube");
      const selected = preferred || fallback;

      if (!selected?.key) {
        setTrailerKey("");
        setMessage("Trailer for this movie is currently unavailable.");
        return;
      }

      setTrailerKey(selected.key);
    } catch (err) {
      console.log(err);
      setError(err?.message || "Failed to load trailer");
      setTrailerKey("");
      setMessage("Trailer for this movie is currently unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const resetTrailer = () => {
    setTrailerKey("");
    setMessage("");
    setError(null);
  };

  return {
    loading,
    error,
    trailerKey,
    message,
    fetchTrailer,
    resetTrailer,
  };
};
