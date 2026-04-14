import { useEffect, useState } from "react";
import { useFav } from "../hooks/useFav";
import styles from "./FavoritePage.module.scss";

const FavPage = () => {
  const { loading, error, favorites, fetchFavorites, removeFav } = useFav();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  useEffect(() => {
    setItems(Array.isArray(favorites) ? favorites : []);
  }, [favorites]);

  const handleRemove = async (tmdbId, mediaType = "movie") => {
    const previousItems = items;
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            String(item.tmdbId) === String(tmdbId) &&
            (item.mediaType || item.type || "movie") === mediaType
          )
      )
    );
    try {
      await removeFav(tmdbId, mediaType);
    } catch {
      setItems(previousItems);
    }
  };

  if (loading && items.length === 0) {
    return <p className={styles.loading}>Loading favorites...</p>;
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>My Favorites</h1>
      {error ? <p className={styles.error}>{error}</p> : null}

      {items.length === 0 ? (
        <p className={styles.empty}>No favorites added yet</p>
      ) : (
        <section className={styles.grid}>
          {items.map((item) => {
            const mediaType = item.type || item.mediaType || "movie";
            return (
              <article
                className={styles.card}
                key={`${item.tmdbId}-${mediaType}`}
              >
                <img
                  className={styles.poster}
                  src={`https://image.tmdb.org/t/p/w500${item.posterPath || ""}`}
                  alt={item.title || "Poster"}
                />
                <div className={styles.meta}>
                  <h2>{item.title || "Untitled"}</h2>
                  <p>{mediaType}</p>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemove(item.tmdbId, mediaType)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default FavPage;
