import { useEffect, useState } from "react";
import { useWatchHistory } from "../hooks/useWatchHistory";
import styles from "./WatchHistoryPage.module.scss";

const WatchHistoryPage = () => {
  const { loading, error, watchHistory, fetchHistory, clearHistory } =
    useWatchHistory();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    setItems(Array.isArray(watchHistory) ? watchHistory : []);
  }, [watchHistory]);

  const handleClearHistory = async () => {
    const previousItems = items;
    setItems([]);
    try {
      await clearHistory();
    } catch {
      setItems(previousItems);
    }
  };

  if (loading && items.length === 0) {
    return <p className={styles.loading}>Loading watch history...</p>;
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1>Watch History</h1>
        <button className={styles.clearButton} onClick={handleClearHistory}>
          Clear History
        </button>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      {items.length === 0 ? (
        <p className={styles.empty}>No watch history found</p>
      ) : (
        <section className={styles.grid}>
          {items.map((item) => (
            <article className={styles.card} key={item._id || item.tmdbId}>
              <img
                className={styles.poster}
                src={`https://image.tmdb.org/t/p/w500${item.poster || ""}`}
                alt={item.title || "Poster"}
              />
              <div className={styles.meta}>
                <h2>{item.title || "Untitled"}</h2>
                <p>{item.type || "movie"}</p>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default WatchHistoryPage;
