import { useState } from 'react';
import styles from './styles/RatingFilter.module.scss';

const RatingFilter = ({ onRatingChange, initialRating = 0 }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingClick = (selectedRating) => {
    const newRating = rating === selectedRating ? 0 : selectedRating;
    setRating(newRating);
    onRatingChange(newRating);
  };

  const StarIcon = ({ filled, partial }) => (
    <svg
      className={`${styles.star} ${filled ? styles.filled : ''} ${
        partial ? styles.partial : ''
      }`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );

  return (
    <div className={styles.ratingFilter}>
      <h3>Minimum Rating</h3>
      <div className={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={styles.starButton}
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            type="button"
            aria-label={`${star} stars`}
          >
            <StarIcon
              filled={hoverRating ? star <= hoverRating : star <= rating}
            />
          </button>
        ))}
        
        {rating > 0 && (
          <button 
            className={styles.clearButton}
            onClick={() => handleRatingClick(0)}
            type="button"
            aria-label="Clear rating filter"
          >
            Clear
          </button>
        )}
      </div>
      
      {rating > 0 && (
        <div className={styles.ratingText}>
          {rating} star{rating !== 1 ? 's' : ''} & up
        </div>
      )}
    </div>
  );
};

export default RatingFilter;