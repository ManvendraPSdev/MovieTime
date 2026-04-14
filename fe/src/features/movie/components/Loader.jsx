import styles from "./Loader.module.scss";

const Loader = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
    </div>
  );
};

export default Loader;
