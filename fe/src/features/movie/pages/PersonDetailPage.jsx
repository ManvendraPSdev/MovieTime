import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Loader from "../components/Loader";
import { getDetails } from "../services/tmdb.api";
import styles from "./PersonDetailPage.module.scss";

const PersonDetailPage = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDetails("person", id);
        if (!cancelled) setPerson(data);
      } catch (e) {
        console.log(e);
        if (!cancelled) {
          setError(
            e?.response?.data?.status_message ||
              e?.message ||
              "Failed to load person"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!person) return <p className={styles.empty}>Person not found.</p>;

  const image = person.profile_path
    ? `https://image.tmdb.org/t/p/h632${person.profile_path}`
    : "/placeholder-poster.svg";

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <img
          className={styles.profile}
          src={image}
          alt={person.name || "Profile"}
        />
        <div className={styles.content}>
          <h1>{person.name || "No Title"}</h1>
          <p className={styles.meta}>{person.known_for_department || ""}</p>
          <p className={styles.bio}>
            {person.biography || "No biography available."}
          </p>
        </div>
      </div>
    </main>
  );
};

export default PersonDetailPage;
