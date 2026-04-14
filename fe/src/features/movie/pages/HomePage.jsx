import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchMovies } from "../services/movie.api";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import styles from "./HomePage.module.scss";

const sections = [
  { title: "Trending Movies", category: "trendingMovies" },
  { title: "Trending TV Shows", category: "trendingTvShows" },
  { title: "Popular Movies", category: "popularMovies" },
  { title: "Popular TV Shows", category: "popularTvShows" },
];

const HomePage = () => {
  const [rows, setRows] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          sections.map((section) =>
            fetchMovies({ category: section.category, limit: 10 })
          )
        );

        const mapped = {};
        sections.forEach((section, index) => {
          mapped[section.title] = results[index]?.movies || [];
        });
        setRows(mapped);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Movie App</h1>
        <Link to="/browse">Browse all</Link>
      </header>

      {sections.map((section) => (
        <section key={section.title} className={styles.section}>
          <h2>{section.title}</h2>
          <div className={styles.row}>
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <SkeletonCard key={`${section.title}-${idx}`} />
                ))
              : (rows[section.title] || []).map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
          </div>
        </section>
      ))}
    </main>
  );
};

export default HomePage;