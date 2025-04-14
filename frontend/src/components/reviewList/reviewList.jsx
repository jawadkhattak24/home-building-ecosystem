import { useState } from "react";
import { FaStar, FaRegStar, FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./styles/reviewList.module.scss";

const ReviewList = ({ reviews }) => {
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [showAll, setShowAll] = useState(false);

  const toggleReview = (reviewId) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  if (!reviews || reviews.length === 0) {
    return <p className={styles.noReviews}>No reviews yet</p>;
  }

  return (
    <div className={styles.reviewList}>
      {displayedReviews.map((review) => {
        const isExpanded = expandedReviews.has(review._id);
        const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return (
          <div key={review._id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.userInfo}>
                {review.userId.profilePictureUrl ? (
                  <img
                    src={review.userId.profilePictureUrl}
                    alt={review.userId.name}
                    className={styles.userAvatar}
                  />
                ) : (
                  <div className={styles.userInitial}>
                    {review.userId.name[0].toUpperCase()}
                  </div>
                )}
                <div className={styles.userMeta}>
                  <h4>{review.userId.name}</h4>
                  <span className={styles.reviewDate}>{formattedDate}</span>
                </div>
              </div>
              <div className={styles.rating}>
                {[...Array(5)].map((_, index) => (
                  index < review.rating ? (
                    <FaStar key={index} className={styles.starFilled} />
                  ) : (
                    <FaRegStar key={index} className={styles.starEmpty} />
                  )
                ))}
              </div>
            </div>

            <div className={styles.reviewContent}>
              <p className={`${styles.description} ${isExpanded ? styles.expanded : ''}`}>
                {review.description}
              </p>
              {review.description.length > 200 && (
                <button
                  className={styles.expandButton}
                  onClick={() => toggleReview(review._id)}
                >
                  {isExpanded ? (
                    <>
                      Show Less <FaChevronUp />
                    </>
                  ) : (
                    <>
                      Show More <FaChevronDown />
                    </>
                  )}
                </button>
              )}
            </div>

            {review.image && (
              <div className={styles.reviewImage}>
                <img src={review.image} alt="Review" />
              </div>
            )}
          </div>
        );
      })}

      {reviews.length > 3 && (
        <button
          className={styles.loadMoreButton}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              Show Less <FaChevronUp />
            </>
          ) : (
            <>
              Show More Reviews ({reviews.length - 3} more) <FaChevronDown />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ReviewList; 