import { useCallback, useEffect, useRef, useState } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import MovieCard from "./MovieCard";
import Loader from "./Loader";
import styles from "./MediaCarousel.module.scss";

const formatItem = (item) => ({
  _id: String(item.id),
  title: item.title || item.name || "No Title",
  poster: item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "",
  overview: item.overview || "",
  vote_average: item.vote_average,
});

const MediaCarousel = ({ title, kind, loadPage }) => {
  const scrollRef = useRef(null);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);
  const inFlightRef = useRef(false);

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const hasMore = totalPages > 0 && page < totalPages;

  const fetchPage = useCallback(
    async (nextPage, append) => {
      try {
        const data = await loadPage(nextPage);
        const raw = Array.isArray(data?.results) ? data.results : [];
        const next = raw.map(formatItem);
        const total = Math.max(1, Number(data?.total_pages) || 1);

        setTotalPages(total);
        setPage(nextPage);

        if (append) {
          setItems((prev) => {
            const seen = new Set(prev.map((x) => x._id));
            const fresh = next.filter((x) => !seen.has(x._id));
            return [...prev, ...fresh];
          });
        } else {
          setItems(next);
        }
      } catch (e) {
        console.log(e);
        setError(e?.message || "Failed to load");
        if (!append) {
          setItems([]);
          setPage(1);
          setTotalPages(0);
        }
      }
    },
    [loadPage]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      setPage(0);
      setTotalPages(1);
      await fetchPage(1, false);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchPage]);

  const loadNext = useCallback(async () => {
    if (!hasMore || loadingMore || loading || inFlightRef.current) return;
    inFlightRef.current = true;
    setLoadingMore(true);
    try {
      await fetchPage(page + 1, true);
    } finally {
      setLoadingMore(false);
      inFlightRef.current = false;
    }
  }, [fetchPage, hasMore, loading, loadingMore, page]);

  useEffect(() => {
    const root = scrollRef.current;
    const target = sentinelRef.current;
    if (!root || !target || loading || !hasMore) {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          loadNext();
        }
      },
      { root, rootMargin: "160px", threshold: 0 }
    );

    observerRef.current.observe(target);
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [hasMore, loadNext, loading, items.length]);

  const scrollByDir = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrowBtn}
            aria-label="Scroll left"
            onClick={() => scrollByDir(-1)}
          >
            <RiArrowLeftSLine size={22} />
          </button>
          <button
            type="button"
            className={styles.arrowBtn}
            aria-label="Scroll right"
            onClick={() => scrollByDir(1)}
          >
            <RiArrowRightSLine size={22} />
          </button>
        </div>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      {loading ? (
        <div className={styles.loaderWrap}>
          <Loader />
        </div>
      ) : (
        <div className={styles.viewport} ref={scrollRef}>
          <div className={styles.track}>
            {items.map((movie) => (
              <div className={styles.cardSlot} key={`${kind}-${movie._id}`}>
                <MovieCard movie={movie} kind={kind} />
              </div>
            ))}
            {loadingMore ? (
              <div className={styles.endSlot} aria-hidden>
                <Loader />
              </div>
            ) : null}
            {hasMore ? <div ref={sentinelRef} className={styles.sentinel} /> : null}
          </div>
        </div>
      )}
    </section>
  );
};

export default MediaCarousel;
