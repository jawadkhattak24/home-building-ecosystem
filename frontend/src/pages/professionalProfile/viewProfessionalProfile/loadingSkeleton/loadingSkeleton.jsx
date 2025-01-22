import styles from "./styles/loadingSkeleton.module.scss";

const LoadingSkeleton = () => {
  return (
    <div className={styles.loadingSkeleton}>
      <div className={styles.basicInfoContainer}>
        <div className={styles.userCard}>
          <div className={styles.nameAndPictureContainer}>
            <div className={styles.imageContainer}>
              <div className={styles.profilePicture}></div>
            </div>
            <div className={styles.nameContainer}>
              <div className={styles.name}></div>
              <div className={styles.city}></div>
              <div className={styles.joinDate}></div>
            </div>
          </div>
          <div className={styles.rating}></div>
          <div className={styles.rateContainer}>
            <div className={styles.rateText}></div>
            <div className={styles.rateAmount}></div>
          </div>
          <div className={styles.contactButton}></div>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.serviceTypeContainer}>
            <div className={styles.serviceType}></div>
            <div className={styles.certifications}></div>
          </div>

          <div className={styles.addressContainer}>
            <div className={styles.addressText}></div>
            <div className={styles.mapPlaceholder}></div>
          </div>

          <div className={styles.qualificationsContainer}>
            <div className={styles.heading}></div>
            <div className={styles.content}></div>
          </div>

          <div className={styles.experienceContainer}>
            <div className={styles.heading}></div>
            <div className={styles.content}></div>
          </div>

          <div className={styles.bioContainer}>
            <div className={styles.heading}></div>
            <div className={styles.content}>
              <div className={styles.line}></div>
              <div className={styles.line}></div>
              <div className={styles.line}></div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.portfolioSection}>
        <div className={styles.heading}></div>
        <div className={styles.portfolioGrid}>
          {[1, 2, 3].map((item) => (
            <div key={item} className={styles.portfolioItem}></div>
          ))}
        </div>
      </div>

      <div className={styles.reviewsSection}>
        <div className={styles.heading}></div>
        <div className={styles.content}></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
