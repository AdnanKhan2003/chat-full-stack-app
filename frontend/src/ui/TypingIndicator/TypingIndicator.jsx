import styles from "./TypingIndicator.module.css";

const TypingIndicator = () => {
  return (
    <div className={`${styles.typing__indicator}`}>
      <div className={`${styles.dot} ${styles.dot__1}`}></div>
      <div className={`${styles.dot} ${styles.dot__2}`}></div>
      <div className={`${styles.dot} ${styles.dot__3}`}></div>
    </div>
  );
};

export default TypingIndicator;
