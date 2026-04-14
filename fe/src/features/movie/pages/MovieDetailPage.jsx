import { useEffect } from "react";
import { useParams } from "react-router";
import Loader from "../components/Loader";
import { useMovie } from "../hooks/useMovie.hook";
import styles from "./MovieDetailPage.module.scss";

const MovieDetailPage = () => {
  const { id } = useParams();
  const { movie, loading, error, getMovie } = useMovie();

  useEffect(() => {
    if (id) {
      getMovie(id);
    }
  }, [getMovie, id]);

  if (loading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!movie) return <p className={styles.empty}>Movie not found.</p>;

  const genres = Array.isArray(movie.genres)
    ? movie.genres.join(", ")
    : movie.genre || "N/A";

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <img
          src={movie.poster || "https://via.placeholder.com/300x450?text=No+Image"}
          alt={movie.title}
          className={styles.poster}
        />
        <div className={styles.content}>
          <h1>{movie.title}</h1>
          <p>{movie.description || "No description available."}</p>
          <p><strong>Genre:</strong> {genres}</p>
          <p><strong>Release Date:</strong> {movie.releaseDate || "N/A"}</p>
        </div>
      </div>
    </main>
  );
};

export default MovieDetailPage;