import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import MovieCard from "../../movie/components/MovieCard";
import Loader from "../../movie/components/Loader";
import PersonCard from "../components/PersonCard";
import { useSearch } from "../hooks/useSearch";
import styles from "./SearchPage.module.scss";

const SearchPage = () => {
  const [params] = useSearchParams();
  const { query, setQuery, results, loading, error } = useSearch();

  useEffect(() => {
    const q = params.get("q") || "";
    setQuery(q);
  }, [params, setQuery]);

  const { media, people } = useMemo(() => {
    const list = (results || []).filter((item) =>
      ["movie", "tv", "person"].includes(item.media_type)
    );
    return {
      media: list.filter((i) => i.media_type !== "person"),
      people: list.filter((i) => i.media_type === "person"),
    };
  }, [results]);

  const mappedMedia = media.map((item) => ({
    ...item,
    cardMovie: {
      _id: String(item.id),
      title: item.title || item.name || "No Title",
      poster: item.poster_path
        ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
        : "/placeholder-poster.svg",
      overview: item.overview || "",
      vote_average: item.vote_average,
    },
  }));

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Search</h1>

      <input
        className={styles.input}
        type="text"
        placeholder="Search movies, TV shows, people..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {error ? <p className={styles.error}>{error}</p> : null}
      {loading ? <Loader /> : null}
      {!loading && query.trim() && media.length === 0 && people.length === 0 ? (
        <p className={styles.empty}>No results found</p>
      ) : null}

      {people.length > 0 ? (
        <>
          <h2 className={styles.sectionTitle}>People</h2>
          <section className={styles.peopleGrid}>
            {people.map((item) => (
              <PersonCard key={`person-${item.id}`} person={item} />
            ))}
          </section>
        </>
      ) : null}

      {mappedMedia.length > 0 ? (
        <>
          <h2 className={styles.sectionTitle}>Movies &amp; TV</h2>
          <section className={styles.mediaGrid}>
            {mappedMedia.map((item) => (
              <div className={styles.mediaCard} key={`${item.media_type}-${item.id}`}>
                <MovieCard movie={item.cardMovie} kind={item.media_type} />
                <p className={styles.type}>{item.media_type}</p>
              </div>
            ))}
          </section>
        </>
      ) : null}
    </main>
  );
};

export default SearchPage;
