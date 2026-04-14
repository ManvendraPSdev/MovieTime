import { Link } from "react-router";
import styles from "./MovieCard.module.scss";

const MovieCard = ({ movie }) => {
  const poster =
    movie?.poster ||
    "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <Link to={`/movies/${movie?._id}`} className={styles.card}>
      <img src={poster} alt={movie?.title || "Movie poster"} className={styles.poster} />
      <p className={styles.title}>{movie?.title || "Untitled"}</p>
    </Link>
  );
};

export default MovieCard;
