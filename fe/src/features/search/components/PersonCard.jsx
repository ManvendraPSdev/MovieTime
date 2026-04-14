import { Link } from "react-router";
import styles from "./PersonCard.module.scss";

const PersonCard = ({ person }) => {
  const image = person?.profile_path
    ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
    : "/placeholder-poster.svg";

  return (
    <Link to={`/person/${person?.id}`} className={styles.card}>
      <img
        src={image}
        alt={person?.name || "Person"}
        className={styles.image}
      />
      <p className={styles.name}>{person?.name || "No Title"}</p>
      <p className={styles.type}>person</p>
    </Link>
  );
};

export default PersonCard;
