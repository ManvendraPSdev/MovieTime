import { useEffect } from "react";
import styles from "./TrailerModal.module.scss";

const TrailerModal = ({ isOpen, onClose, trailerKey, loading, message }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          Close
        </button>

        {loading ? <p className={styles.status}>Loading trailer...</p> : null}

        {!loading && trailerKey ? (
          <iframe
            className={styles.iframe}
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Movie Trailer"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : null}

        {!loading && !trailerKey ? (
          <p className={styles.status}>
            {message || "Trailer for this movie is currently unavailable."}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default TrailerModal;
