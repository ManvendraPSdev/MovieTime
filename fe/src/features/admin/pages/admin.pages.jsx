import { useEffect } from "react";
import { useAdmin } from "../hooks/useAdmin";
import styles from "./AdminPage.module.scss";

export default function AdminPage() {
  const {
    users,
    loading,
    error,
    getUsers,
    banUserById,
    unbanUserById,
    removeUser,
  } = useAdmin();

  useEffect(() => {
    getUsers();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.page}>
      <h1>Admin Panel</h1>

      <div className={styles.grid}>
        {users.map((user) => (
          <div key={user._id} className={styles.card}>
            <p><strong>{user.userName}</strong></p>
            <p>{user.email}</p>

            <div className={styles.actions}>
              <button onClick={() => banUserById(user._id, "Violation")}>
                Ban
              </button>

              <button onClick={() => unbanUserById(user._id)}>
                Unban
              </button>

              <button onClick={() => removeUser(user._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}