import styles from "./UserDetailPage.module.scss";

const UserDetailPage = () => {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    plan: "Free",
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>User Details</h1>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Plan:</strong> {user.plan}</p>
      </div>
    </main>
  );
};

export default UserDetailPage;