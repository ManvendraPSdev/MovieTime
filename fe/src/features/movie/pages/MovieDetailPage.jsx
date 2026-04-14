import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router";
import Loader from "../components/Loader";
import TrailerModal from "../components/TrailerModal";
import { useMovie } from "../hooks/useMovie.hook";
import { useTrailer } from "../hooks/useTrailer";
import { useTmdbApi } from "../hooks/useTmdbApi";
import { fetchMovieByTmdbId } from "../services/movie.api";
import { getCredits } from "../services/tmdb.api";
import styles from "./MovieDetailPage.module.scss";

const isMongoId = (value) =>
  /^[a-fA-F0-9]{24}$/.test(String(value || ""));

const mapTmdbToView = (data, mediaKind) => ({
  tmdbId: String(data.id || ""),
  mediaType: data.media_type || mediaKind,
  title: data.title || data.name || "No Title",
  poster: data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : "/placeholder-poster.svg",
  backdrop: data.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`
    : "",
  description: data.overview || "",
  overview: data.overview || "",
  vote_average: data.vote_average,
  voteAverage: data.vote_average,
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

const normalizeBackendDoc = (doc, mediaKind) => {
  const d = { ...doc };
  return {
    ...d,
    title: d.title || "No Title",
    poster: d.poster
      ? d.poster.startsWith("http")
        ? d.poster
        : `https://image.tmdb.org/t/p/w500${d.poster}`
      : "/placeholder-poster.svg",
    backdrop: d.banner
      ? d.banner.startsWith("http")
        ? d.banner
        : `https://image.tmdb.org/t/p/w1280${d.banner}`
      : "",
    overview: d.description || "",
    mediaType: d.category === "tv" ? "tv" : mediaKind,
    tmdbId: d.tmdbId ? String(d.tmdbId) : "",
  };
};

const MovieDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const mediaKind = location.pathname.startsWith("/tv") ? "tv" : "movie";

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
  const [cast, setCast] = useState([]);

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
          setTmdbMovie(normalizeBackendDoc(fromDb, mediaKind));
          return;
        }

        const details = await getDetails(mediaKind, id);
        if (cancelled) return;
        setTmdbMovie(mapTmdbToView(details, mediaKind));
      } catch (e) {
        if (!cancelled) {
          setTmdbError(
            e?.response?.data?.message ||
              e?.message ||
              "Failed to load title"
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
  }, [id, getMovie, getDetails, mediaKind]);

  const mongo = isMongoId(id);
  const displayMovie = mongo ? movie : tmdbMovie;
  const displayLoading = mongo ? loading : tmdbLoading;
  const displayError = mongo ? error : tmdbError;

  const creditsKind = useMemo(() => {
    if (!displayMovie) return mediaKind;
    if (displayMovie.mediaType === "tv" || displayMovie.category === "tv") {
      return "tv";
    }
    return "movie";
  }, [displayMovie, mediaKind]);

  const creditsId = useMemo(() => {
    if (!displayMovie) return "";
    if (mongo) return displayMovie.tmdbId || "";
    return displayMovie.tmdbId || id || "";
  }, [displayMovie, mongo, id]);

  useEffect(() => {
    if (!creditsId) {
      setCast([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await getCredits(creditsKind, creditsId);
        if (cancelled) return;
        const list = Array.isArray(data?.cast) ? data.cast.slice(0, 14) : [];
        setCast(list);
      } catch (e) {
        console.log(e);
        if (!cancelled) setCast([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [creditsKind, creditsId]);

  if (displayLoading) return <Loader />;
  if (displayError) return <p className={styles.error}>{displayError}</p>;
  if (!displayMovie) return <p className={styles.empty}>Not found.</p>;

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

  const backdrop =
    displayMovie.backdrop ||
    (displayMovie.poster && displayMovie.poster !== "/placeholder-poster.svg"
      ? displayMovie.poster
      : "");

  return (
    <div className={styles.wrap}>
      <section
        className={styles.hero}
        style={
          backdrop
            ? {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url(${backdrop})`,
              }
            : undefined
        }
      >
        <div className={styles.heroInner}>
          <img
            className={styles.poster}
            src={
              displayMovie.poster ||
              "/placeholder-poster.svg"
            }
            alt={title}
          />
          <div className={styles.detail}>
            <div className={styles.badges}>
              {typeof displayMovie.vote_average === "number" ? (
                <span className={styles.rating}>
                  {displayMovie.vote_average.toFixed(1)}
                </span>
              ) : typeof displayMovie.voteAverage === "number" ? (
                <span className={styles.rating}>
                  {displayMovie.voteAverage.toFixed(1)}
                </span>
              ) : null}
              <span className={styles.typePill}>{trailerType}</span>
            </div>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.chips}>
              {genreList.length
                ? genreList.map((g) => (
                    <span key={g} className={styles.chip}>
                      {g}
                    </span>
                  ))
                : (
                  <span className={styles.chip}>{genres}</span>
                )}
            </div>
            <p className={styles.overview}>
              {displayMovie.description || "No description available."}
            </p>
            <p className={styles.metaLine}>
              <strong>Release:</strong> {displayMovie.releaseDate || "N/A"}
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleOpenTrailer}
              >
                Watch Trailer
              </button>
            </div>
            {trailerError ? (
              <p className={styles.inlineError}>{trailerError}</p>
            ) : null}
          </div>
          <aside className={styles.cast}>
            <h2>Cast</h2>
            <ul>
              {cast.length === 0 ? (
                <li className={styles.castEmpty}>No cast data.</li>
              ) : (
                cast.map((c) => (
                  <li key={c.id || c.credit_id}>
                    <strong>{c.name}</strong>
                    {c.character ? (
                      <span className={styles.character}> — {c.character}</span>
                    ) : null}
                  </li>
                ))
              )}
            </ul>
          </aside>
        </div>
      </section>

      <TrailerModal
        isOpen={showTrailer}
        onClose={handleCloseTrailer}
        trailerKey={trailerKey}
        loading={trailerLoading}
        message={trailerMessage}
      />
    </div>
  );
};

export default MovieDetailPage;
