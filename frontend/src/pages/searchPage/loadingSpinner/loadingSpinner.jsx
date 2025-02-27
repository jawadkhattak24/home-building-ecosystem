import styles from "./styles/loadingSpinner.module.scss";

const LoadingSpinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p>Loading results...</p>
    </div>
  );
};

export default LoadingSpinner;
