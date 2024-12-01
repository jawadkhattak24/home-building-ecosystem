import styles from "./styles/loadingSkeleton.module.scss";

const InboxSidebarSkeleton = () => {
  const skeletonItems = Array(5).fill(null);

  return (
    <div className={styles.sidebar}>
      {skeletonItems.map((_, index) => (
        <div key={index} className={styles.message_list}>
          <div className={styles.avatarSkeleton}></div>
          <div className={styles.converationsDetailsContainer}>
            <div className={styles.nameAndDateContainer}>
              <div className={styles.nameSkeleton}></div>
              <div className={styles.dateSkeleton}></div>
            </div>
            <div className={styles.messageSkeleton}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InboxSidebarSkeleton;
