import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Loader from "../components/Loader";
import TrailerModal from "../components/TrailerModal";
import { useMovie } from "../hooks/useMovie.hook";
import { useTrailer } from "../hooks/useTrailer";
import { useTmdbApi } from "../hooks/useTmdbApi";
import { fetchMovieByTmdbId } from "../services/movie.api";
import styles from "./MovieDetailPage.module.scss";

/** Backend uses Mongo ObjectIds; home TMDB cards use numeric TMDB ids. */
const isMongoId = (value) =>
  /^[a-fA-F0-9]{24}$/.test(String(value || ""));

const mapTmdbMovieToView = (data) => ({
  tmdbId: String(data.id || ""),
  mediaType: data.media_type || "movie",
  title: data.title || data.name || "Untitled",
  poster: data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : "",
  description: data.overview || "",
  genres: Array.isArray(data.genres)
    ? data.genres.map((g) => (typeof g === "string" ? g : g?.name)).filter(Boolean)
    : [],
  genre: data.genres?.[0]
    ? typeof data.genres[0] === "string"
      ? data.genres[0]
      : data.genres[0]?.name
    : "",
  releaseDate: data.release_date || data.first_air_date || "",
});

const MovieDetailPage = () => {
  const { id } = useParams();
  const { movie, loading, error, getMovie } = useMovie();
  const { getDetails } = useTmdbApi();
  const [showTrailer, setShowTrailer] = useState(false);
  const {
    loading: trailerLoading,
    error: trailerError,
    trailerKey,
    message: trailerMessage,
    fetchTrailer,
    resetTrailer,
  } = useTrailer();

  const [tmdbMovie, setTmdbMovie] = useState(null);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [tmdbError, setTmdbError] = useState(null);

  useEffect(() => {
    if (!id) return;

    if (isMongoId(id)) {
      setTmdbMovie(null);
      setTmdbError(null);
      getMovie(id);
      return;
    }

    let cancelled = false;
    setTmdbMovie(null);

    const load = async () => {
      setTmdbLoading(true);
      setTmdbError(null);
      try {
        let fromDb = null;
        try {
          fromDb = await fetchMovieByTmdbId(id);
        } catch {
          fromDb = null;
        }
        if (cancelled) return;
        if (fromDb) {
          setTmdbMovie(fromDb);
          return;
        }

        const details = await getDetails("movie", id);
        if (cancelled) return;
        setTmdbMovie(mapTmdbMovieToView(details));
      } catch (e) {
        if (!cancelled) {
          setTmdbError(
            e?.response?.data?.message ||
              e?.message ||
              "Failed to load movie"
          );
        }
      } finally {
        if (!cancelled) setTmdbLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, getMovie, getDetails]);

  const mongo = isMongoId(id);
  const displayMovie = mongo ? movie : tmdbMovie;
  const displayLoading = mongo ? loading : tmdbLoading;
  const displayError = mongo ? error : tmdbError;

  if (displayLoading) return <Loader />;
  if (displayError) return <p className={styles.error}>{displayError}</p>;
  if (!displayMovie) return <p className={styles.empty}>Movie not found.</p>;

  const genreList = Array.isArray(displayMovie.genres)
    ? displayMovie.genres.map((g) =>
        typeof g === "string" ? g : g?.name
      ).filter(Boolean)
    : [];
  const genres =
    genreList.length > 0
      ? genreList.join(", ")
      : displayMovie.genre || "N/A";
  const title = displayMovie.title || displayMovie.name || "No Title";
  const trailerType =
    displayMovie.mediaType === "tv" || displayMovie.category === "tv"
      ? "tv"
      : "movie";
  const trailerId = mongo
    ? displayMovie.tmdbId
    : displayMovie.tmdbId || id;

  const handleOpenTrailer = async () => {
    setShowTrailer(true);
    await fetchTrailer(trailerType, trailerId);
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
    resetTrailer();
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <img
          src={
            displayMovie.poster ||
            "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={displayMovie.title}
          className={styles.poster}
        />
        <div className={styles.content}>
          <h1>{title}</h1>
          <p>{displayMovie.description || "No description available."}</p>
          <p>
            <strong>Genre:</strong> {genres}
          </p>
          <p>
            <strong>Release Date:</strong>{" "}
            {displayMovie.releaseDate || "N/A"}
          </p>
          <button onClick={handleOpenTrailer} className={styles.trailerButton}>
            Watch Trailer
          </button>
          {trailerError ? <p className={styles.error}>{trailerError}</p> : null}
        </div>
      </div>
      <TrailerModal
        isOpen={showTrailer}
        onClose={handleCloseTrailer}
        trailerKey={trailerKey}
        loading={trailerLoading}
        message={trailerMessage}
      />
    </main>
  );
};

export default MovieDetailPage;
