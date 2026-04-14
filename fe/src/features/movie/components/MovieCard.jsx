import { Link } from "react-router";
import styles from "./MovieCard.module.scss";

const PLACEHOLDER = "/placeholder-poster.svg";

const MovieCard = ({ movie, kind = "movie" }) => {
  const id = movie?._id;
  const href = kind === "tv" ? `/tv/${id}` : `/movie/${id}`;
  const rawPoster = movie?.poster;
  const poster = !rawPoster
    ? PLACEHOLDER
    : String(rawPoster).startsWith("http") || String(rawPoster).startsWith("/")
      ? rawPoster
      : `https://image.tmdb.org/t/p/w342${rawPoster}`;

  const title = movie?.title || movie?.name || "No Title";
  const rating =
    typeof movie?.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : null;

  return (
    <Link to={href} className={styles.card}>
      <div className={styles.posterWrap}>
        <img src={poster} alt={title} className={styles.poster} />
        {rating ? <span className={styles.rating}>{rating}</span> : null}
        <div className={styles.hover}>
          <p className={styles.hoverTitle}>{title}</p>
          {movie?.overview ? (
            <p className={styles.hoverOverview}>{movie.overview}</p>
          ) : null}
        </div>
      </div>
      <p className={styles.title}>{title}</p>
    </Link>
  );
};

export default MovieCard;
