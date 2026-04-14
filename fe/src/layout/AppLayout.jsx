import { Outlet } from "react-router";
import Header from "./Header";
import ToastStack from "./ToastStack";
import styles from "./AppLayout.module.scss";

const AppLayout = () => {
  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>
      <ToastStack />
    </div>
  );
};

export default AppLayout;
