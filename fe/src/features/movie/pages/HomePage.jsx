import { useCallback } from "react";
import MediaCarousel from "../components/MediaCarousel";
import { useTmdbApi } from "../hooks/useTmdbApi";
import styles from "./HomePage.module.scss";

const HomePage = () => {
  const { getTrending, getPopular } = useTmdbApi();

  const loadTrendingMovies = useCallback(
    (p) => getTrending("movie", "day", p),
    [getTrending]
  );

  const loadTrendingTv = useCallback(
    (p) => getTrending("tv", "day", p),
    [getTrending]
  );

  const loadPopularMovies = useCallback(
    (p) => getPopular("movie", p),
    [getPopular]
  );

  const loadPopularTv = useCallback(
    (p) => getPopular("tv", p),
    [getPopular]
  );

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Discover</h1>
        <p className={styles.heroSub}>
          Trending and popular titles — scroll each row sideways. More pages load
          when you reach the end.
        </p>
      </header>

      <MediaCarousel
        title="Trending Movies"
        kind="movie"
        loadPage={loadTrendingMovies}
      />
      <MediaCarousel
        title="Trending TV Shows"
        kind="tv"
        loadPage={loadTrendingTv}
      />
      <MediaCarousel
        title="Popular Movies"
        kind="movie"
        loadPage={loadPopularMovies}
      />
      <MediaCarousel
        title="Popular TV Shows"
        kind="tv"
        loadPage={loadPopularTv}
      />
    </main>
  );
};

export default HomePage;
