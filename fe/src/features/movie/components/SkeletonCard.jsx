import styles from "./SkeletonCard.module.scss";

const SkeletonCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.poster} />
      <div className={styles.title} />
    </div>
  );
};

export default SkeletonCard;
