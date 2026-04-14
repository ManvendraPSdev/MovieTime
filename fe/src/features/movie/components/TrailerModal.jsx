import styles from "./TrailerModal.module.scss";

const TrailerModal = ({ isOpen, onClose, trailerKey, loading, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>

        {loading ? <p>Loading trailer...</p> : null}

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
          <p>{message || "Trailer for this movie is currently unavailable."}</p>
        ) : null}
      </div>
    </div>
  );
};

export default TrailerModal;
