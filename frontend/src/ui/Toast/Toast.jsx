import { MdOutlineDoneOutline } from "react-icons/md";
import { ImCross } from "react-icons/im";

import styles from "./Toast.module.css";
import { useRef } from "react";
import { useEffect } from "react";
import ToastPortal from "./ToastPortal/ToastPortal";
import Progress from "../Progress/Progress";

const Toast = ({
  type,
  title,
  message,
  duration = 3000,
  position,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <ToastPortal>
      <div
        className={`${styles.toast} ${
          position === "bottom" ? styles.position__bottom : styles.position__top
        }`}
      >
        <div className={`${styles.toast__content__container}`}>
          <div className={styles.toast__icon}>
            {type === "success" ? (
              <MdOutlineDoneOutline className={styles.icon__success} />
            ) : (
              <ImCross className={styles.icon__error} />
            )}
          </div>
          <div className="toast__content">
            <h5
              className={`${styles.toast__title} ${
                type === "success"
                  ? styles.message__success
                  : styles.message__error
              }`}
            >
              {title}
            </h5>
            <p className={`${styles.toast__message}`}>{message}</p>
          </div>
        </div>
        <ImCross onClick={onClose} className={`${styles.toast__close}`} />
        <Progress duration={duration} />
      </div>
    </ToastPortal>
  );
};

export default Toast;
