import { useCallback, useEffect, useRef, useState } from "react";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import SkeletonCard from "../components/SkeletonCard";
import { useMovie } from "../hooks/useMovie.hook";
import styles from "./BrowsePage.module.scss";

const BrowsePage = () => {
  const { movies, loading, error, getMovies } = useMovie();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  const loadPage = useCallback(
    async (nextPage, append = true) => {
      const data = await getMovies({ page: nextPage, limit: 20 }, { append });
      const totalPages = data?.totalPages || 1;
      setPage(nextPage);
      setHasMore(nextPage < totalPages);
    },
    [getMovies]
  );

  useEffect(() => {
    loadPage(1, false);
  }, [loadPage]);

  const sentinelRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore) {
          loadPage(page + 1, true);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [hasMore, loadPage, loading, page]
  );

  return (
    <main className={styles.page}>
      <h1>Browse Movies</h1>

      {error ? <p className={styles.error}>{error}</p> : null}

      <section className={styles.grid}>
        {movies.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            kind={movie.category === "tv" ? "tv" : "movie"}
          />
        ))}

        {loading && movies.length === 0
          ? Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          : null}
      </section>

      {loading && movies.length > 0 ? <Loader /> : null}
      <div ref={sentinelRef} className={styles.sentinel} />
      {!hasMore && movies.length > 0 ? <p className={styles.end}>No more movies.</p> : null}
    </main>
  );
};

export default BrowsePage;
