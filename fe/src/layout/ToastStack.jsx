import { RiCheckboxCircleFill, RiErrorWarningFill } from "react-icons/ri";
import { useToast } from "./ToastContext";
import styles from "./ToastStack.module.scss";

const ToastStack = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.stack} role="status">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${styles.toast} ${styles[t.type] || styles.success}`}
        >
          {t.type === "error" ? (
            <RiErrorWarningFill className={styles.icon} aria-hidden />
          ) : (
            <RiCheckboxCircleFill className={styles.icon} aria-hidden />
          )}
          <span>{t.message}</span>
          <button
            type="button"
            className={styles.dismiss}
            onClick={() => removeToast(t.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastStack;
