import styles from "./styles/userInfoSidebarSkeleton.module.scss";

const UserInfoSidebarSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonPhoto} />
        
        <div className={styles.skeletonUserInfo}>
          <div className={styles.skeletonName} />
          <div className={styles.skeletonServiceType} />
          
          <div className={styles.skeletonDetails}>
            <div className={styles.skeletonRating} />
            <div className={styles.skeletonRate} />
          </div>
          
          <div className={styles.skeletonBio} />
        </div>
      </div>

      <div className={styles.skeletonButton} />
    </div>
  );
};

export default UserInfoSidebarSkeleton;