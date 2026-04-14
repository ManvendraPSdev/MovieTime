import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";
import Loader from "../components/Loader";
import TrailerModal from "../components/TrailerModal";
import { useAuth } from "../../auth/hooks/useAuth.hook";
import { useMovie } from "../hooks/useMovie.hook";
import { useTrailer } from "../hooks/useTrailer";
import { useTmdbApi } from "../hooks/useTmdbApi";
import { fetchMovieByTmdbId } from "../services/movie.api";
import { getCredits } from "../services/tmdb.api";
import {
  addFavorite,
  checkFavorite,
  removeFavorite,
} from "../../favorite/services/fav.api";
import { addWatchHistory } from "../../watchHistory/services/watchHistory.api";
import styles from "./MovieDetailPage.module.scss";

const isMongoId = (value) =>
  /^[a-fA-F0-9]{24}$/.test(String(value || ""));

/** Store TMDB-style path (/file.jpg) so list pages can prefix w500. */
function posterPathForApi(posterUrl) {
  if (!posterUrl || posterUrl === "/placeholder-poster.svg") return "";
  if (posterUrl.startsWith("/") && !posterUrl.startsWith("//")) return posterUrl;
  const m = String(posterUrl).match(/\/t\/p\/[^/]+(\/[^?#]+)/);
  return m ? m[1] : "";
}

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
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const [isFav, setIsFav] = useState(false);
  const [favBusy, setFavBusy] = useState(false);

  const historyLoggedRef = useRef("");

  useEffect(() => {
    historyLoggedRef.current = "";
  }, [id, user?._id, user?.id]);

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

  const historyMeta = useMemo(() => {
    if (!displayMovie) return null;
    const tid = String(
      mongo ? displayMovie.tmdbId || "" : displayMovie.tmdbId || id || ""
    );
    if (!tid) return null;
    const type =
      displayMovie.mediaType === "tv" || displayMovie.category === "tv"
        ? "tv"
        : "movie";
    return {
      tid,
      type,
      title: displayMovie.title || displayMovie.name || "No Title",
      overview: displayMovie.overview || displayMovie.description || "",
      poster: posterPathForApi(displayMovie.poster),
    };
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

  useEffect(() => {
    if (!user || displayLoading || displayError || !historyMeta) return;
    const key = `${historyMeta.type}:${historyMeta.tid}`;
    if (historyLoggedRef.current === key) return;
    historyLoggedRef.current = key;

    addWatchHistory({
      tmdbId: historyMeta.tid,
      type: historyMeta.type,
      title: historyMeta.title,
      poster: historyMeta.poster,
      overview: historyMeta.overview,
    }).catch((e) => console.log(e));
  }, [user, displayLoading, displayError, historyMeta]);

  useEffect(() => {
    if (!user || displayLoading || displayError || !historyMeta) {
      if (!user) setIsFav(false);
      return;
    }
    let cancelled = false;
    checkFavorite(historyMeta.tid, historyMeta.type)
      .then((d) => {
        if (!cancelled) setIsFav(!!d?.isFavorite);
      })
      .catch(() => {
        if (!cancelled) setIsFav(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, displayLoading, displayError, historyMeta]);

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

  const handleToggleFavorite = async () => {
    if (!historyMeta) return;
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (favBusy) return;
    setFavBusy(true);
    try {
      if (isFav) {
        await removeFavorite(historyMeta.tid, historyMeta.type);
        setIsFav(false);
      } else {
        await addFavorite({
          tmdbId: historyMeta.tid,
          mediaType: historyMeta.type === "tv" ? "tv" : "movie",
          title: historyMeta.title,
          posterPath: historyMeta.poster,
          overView: historyMeta.overview,
        });
        setIsFav(true);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setFavBusy(false);
    }
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
              <button
                type="button"
                className={`${styles.favBtn} ${isFav ? styles.favBtnActive : ""}`}
                onClick={handleToggleFavorite}
                disabled={favBusy || !historyMeta}
                title={
                  !historyMeta
                    ? "Unavailable"
                    : user
                      ? isFav
                        ? "Remove from favorites"
                        : "Add to favorites"
                      : "Log in to save favorites"
                }
                aria-pressed={isFav}
                aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
              >
                {isFav ? (
                  <RiHeartFill size={22} />
                ) : (
                  <RiHeartLine size={22} />
                )}
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
