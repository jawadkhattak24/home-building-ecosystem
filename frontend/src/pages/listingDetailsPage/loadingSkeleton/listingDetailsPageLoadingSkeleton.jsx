import styles from "./styles/listingDetailsPageLoadingSkeleton.module.scss";

const ListingDetailsPageLoadingSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.productInfo}>
        <div className={styles.header}>
          <div className={styles.titleSkeleton}></div>
        </div>

        <div className={styles.materialInfo}>
          <div className={styles.ratingSkeleton}></div>

          <div className={styles.specificationsSkeleton}>
            <div className={styles.specLine}></div>
            <div className={styles.specLine}></div>
            <div className={styles.specLine}></div>
          </div>

          <div className={styles.priceSkeleton}></div>

          <div className={styles.ctaButtonSkeleton}>
            <div className={styles.buttonSkeleton}></div>
            <div className={styles.buttonSkeleton}></div>
          </div>
        </div>

        <div className={styles.descriptionSection}>
          <div className={styles.sectionTitleSkeleton}></div>
          <div className={styles.descriptionSkeleton}>
            <div className={styles.descLine}></div>
            <div className={styles.descLine}></div>
            <div className={styles.descLine}></div>
            <div className={styles.descLine}></div>
          </div>
        </div>

        <div className={styles.documentsSection}>
          <div className={styles.sectionTitleSkeleton}></div>
          <div className={styles.documentLinkSkeleton}></div>
        </div>

        <div className={styles.reviewsSection}>
          <div className={styles.sectionTitleSkeleton}></div>
          {[1, 2].map((_, index) => (
            <div key={index} className={styles.reviewSkeleton}>
              <div className={styles.reviewHeaderSkeleton}>
                <div className={styles.avatarSkeleton}></div>
                <div className={styles.reviewMetaSkeleton}>
                  <div className={styles.ratingLineSkeleton}></div>
                  <div className={styles.dateSkeleton}></div>
                </div>
              </div>
              <div className={styles.reviewContentSkeleton}></div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.imageGallery}>
        <div className={styles.primaryImageSkeleton}></div>
        <div className={styles.thumbnailsSkeleton}>
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className={styles.thumbnailSkeleton}></div>
          ))}
        </div>
        <div className={styles.supplierCardSkeleton}>
          <div className={styles.logoSkeleton}></div>
          <div className={styles.supplierInfoSkeleton}>
            <div className={styles.supplierNameSkeleton}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsPageLoadingSkeleton;
