import MovieCard from "../../movie/components/MovieCard";
import Loader from "../../movie/components/Loader";
import PersonCard from "../components/PersonCard";
import { useSearch } from "../hooks/useSearch";
import styles from "./SearchPage.module.scss";

const SearchPage = () => {
  const { query, setQuery, results, loading, error } = useSearch();

  const mappedResults = results
    .filter((item) => ["movie", "tv", "person"].includes(item.media_type))
    .map((item) => ({
      ...item,
      cardMovie: {
        _id: String(item.id),
        title: item.title || item.name || "No Title",
        poster: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : "https://via.placeholder.com/300x450?text=No+Image",
      },
    }));

  return (
    <main className={styles.page}>
      <h1>Search</h1>

      <input
        className={styles.input}
        type="text"
        placeholder="Search movies, TV shows, people..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {error ? <p className={styles.error}>{error}</p> : null}
      {loading ? <Loader /> : null}
      {!loading && query.trim() && mappedResults.length === 0 ? (
        <p className={styles.empty}>No results found</p>
      ) : null}

      <section className={styles.grid}>
        {mappedResults.map((item) => {
          if (item.media_type === "person") {
            return <PersonCard key={`person-${item.id}`} person={item} />;
          }
          return (
            <div className={styles.mediaCard} key={`${item.media_type}-${item.id}`}>
              <MovieCard movie={item.cardMovie} />
              <p className={styles.type}>{item.media_type}</p>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default SearchPage;
