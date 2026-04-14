import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { useTmdbApi } from "../hooks/useTmdbApi";
import styles from "./HomePage.module.scss";

const HomePage = () => {
  const { getTrending } = useTmdbApi();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getTrending("movie", "day");
        const formatted = (data?.results || []).map((movie) => ({
          _id: String(movie.id),
          title: movie.title || movie.name || "Untitled",
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "",
          overview: movie.overview || "",
          vote_average: movie.vote_average,
        }));
        setMovies(formatted);
      } catch (error) {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Trending Movies</h1>
      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <section className={styles.grid}>
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} kind="movie" />
          ))}
        </section>
      )}
    </main>
  );
};

export default HomePage;