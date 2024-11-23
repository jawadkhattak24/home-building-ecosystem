import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "redaxios";
import styles from "./styles/service-card.module.scss";
import PropTypes from "prop-types";

function ServiceCard({ service }) {
  useEffect(() => {
    const recordImpression = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/service/${
            service._id
          }/impression`
        );
      } catch (error) {
        console.error("Error recording impression:", error);
      }
    };

    recordImpression();
  }, [service._id]);

  return (
    <Link to={`/service/${service._id}`}>
      <div className={styles.service_card}>
        <img
          className={styles.thumbnailImage}
          width={400}
          height={150}
          src={service.images[0]}
          alt={service.category}
        />
        <div className={styles.cardDetails}>
          <h3 className={styles.serviceTitle}>{service.title}</h3>

          <div className={styles.providerDetails}>
            <img
              className={styles.providerImage}
              width={40}
              height={40}
              src={service.providerProfilePicture}
              alt={service.serviceProvider}
            />

            <p>{service.serviceProvider}</p>
          </div>

          <p>
            ⭐ {service.rating} ({service.numReviews})
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ServiceCard;

ServiceCard.propTypes = {
  service: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    thumbnailUrl: PropTypes.string,
    title: PropTypes.string.isRequired,
    rating: PropTypes.number,
    numReviews: PropTypes.number,
  }).isRequired,
};
