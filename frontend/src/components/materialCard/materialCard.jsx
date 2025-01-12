import { Link } from "react-router-dom";
import styles from "./styles/materialCard.module.scss";
import PropTypes from "prop-types";

function MaterialCard({ material }) {
  return (
    <Link to={`/material/${material.id}`} className={styles.materialCard}>
      <div className={styles.imageContainer}>
        <img
          src={material.image}
          alt={material.name}
          className={styles.materialImage}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x200";
          }}
        />
        <span className={styles.price}>${material.price}</span>
      </div>
      <div className={styles.details}>
        <h3 className={styles.name}>{material.name}</h3>
        <p className={styles.supplier}>{material.supplier}</p>
        <div className={styles.rating}>
          ⭐ {material.rating} ({material.reviewCount} reviews)
        </div>
      </div>
    </Link>
  );
}

MaterialCard.propTypes = {
  material: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    supplier: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    reviewCount: PropTypes.number.isRequired,
  }).isRequired,
};

export default MaterialCard;
