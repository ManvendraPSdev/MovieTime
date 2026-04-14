import { useEffect, useState } from "react";
import { searchMulti } from "../services/search.api";

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const value = query.trim();
    if (!value) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchMulti(value);
        setResults(Array.isArray(data?.results) ? data.results : []);
      } catch (err) {
        console.log(err);
        setError(
          err?.response?.data?.status_message ||
            err?.message ||
            "Search failed"
        );
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
  };
};
