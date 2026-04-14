import styles from "./PersonCard.module.scss";

const PersonCard = ({ person }) => {
  const image = person?.profile_path
    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <article className={styles.card}>
      <img src={image} alt={person?.name || "Person"} className={styles.image} />
      <p className={styles.name}>{person?.name || "No Title"}</p>
      <p className={styles.type}>person</p>
    </article>
  );
};

export default PersonCard;
