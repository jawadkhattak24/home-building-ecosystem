import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "redaxios";
import styles from "./styles/service-card.module.scss";
import PropTypes from "prop-types";

function ProfessionalCard({ professional }) {
  const {
    userId: { name, profilePictureUrl, coverPictureUrl },
  } = professional;

  useEffect(() => {
    console.log("Profile Picture URL:", profilePictureUrl);
    console.log("Cover Picture URL:", coverPictureUrl);
  }, [profilePictureUrl, coverPictureUrl]);

  useEffect(() => {
    const recordImpression = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/professional/${
            professional.id
          }/impression`
        );
      } catch (error) {
        console.error("Error recording impression:", error);
      }
    };

    recordImpression();
  }, [professional.id]);

  const averageRating =
    professional.reviews.length > 0
      ? professional.reviews.reduce((acc, review) => acc + review.rating, 0) /
        professional.reviews.length
      : 0;

  return (
    <Link to={`/professional-profile/${professional.userId._id}`}>
      <div className={styles.professional_card}>
        <img
          className={styles.portfolioImage}
          width={400}
          height={150}
          src={coverPictureUrl}
          alt={`${professional.serviceType} Portfolio`}
        />
        <div className={styles.cardDetails}>
          <div className={styles.professionalInfo}>
            <img
              className={styles.profileImage}
              width={60}
              height={60}
              src={profilePictureUrl}
              alt={name}
            />
            <div className={styles.nameAndType}>
              <h3 className={styles.name}>{name}</h3>
              <p className={styles.serviceType}>{professional.serviceType}</p>
            </div>
          </div>

          <div className={styles.stats}>
            <p className={styles.experience}>
              {professional.yearsExperience} years experience
            </p>
            <p className={styles.rating}>
              ⭐ {averageRating.toFixed(1)} ({professional.reviews.length}{" "}
              reviews)
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProfessionalCard;

ProfessionalCard.propTypes = {
  professional: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    serviceType: PropTypes.oneOf([
      "Architect",
      "Interior Designer",
      "Contractor",
      "Plumber",
      "Painter",
      "Electrician",
      "3D Modeler",
      "Material Supplier",
    ]).isRequired,
    yearsExperience: PropTypes.number.isRequired,
    portfolio: PropTypes.arrayOf(PropTypes.string).isRequired,
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        rating: PropTypes.number.isRequired,
      })
    ).isRequired,
    userId: PropTypes.shape({
      name: PropTypes.string.isRequired,
      profilePictureUrl: PropTypes.string,
      coverPictureUrl: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
