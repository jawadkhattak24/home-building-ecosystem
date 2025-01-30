const StarRatings = ({ rating }) => {
    return (
      <div className="star-ratings">
        {[...Array(5)].map((_, i) => (
          <i 
            key={i}
            className={`fas fa-star${i < Math.floor(rating) ? '' : '-o'}`}
          />
        ))}
      </div>
    );
  };
  
  export default StarRatings;