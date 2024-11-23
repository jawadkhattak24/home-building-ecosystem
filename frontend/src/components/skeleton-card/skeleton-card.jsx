import styles from "./styles/skeleton-card.module.scss";

function SkeletonCard() {
  return (
    <div className={styles.skeleton_service_card}>
      <div className={styles.skeleton_thumbnail} />
      <div className={styles.skeleton_cardDetails}>
        <div className={styles.skeleton_text_large}></div>
        <div className={styles.skeleton_text_small}></div>
        <div className={styles.skeleton_text_full}></div>
      </div>
    </div>
  );
}

export default SkeletonCard;
