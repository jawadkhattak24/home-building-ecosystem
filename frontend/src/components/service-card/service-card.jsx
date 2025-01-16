import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./styles/service-card.module.scss";
import PropTypes from "prop-types";

function ProfessionalCard({ professional, showCoverImage }) {
  const { name, profilePictureUrl, coverPictureUrl } =
    professional?.userId || professional?.id || {};

  useEffect(() => {
    axios.post(
      `${import.meta.env.VITE_API_URL}/api/user/${professional?._id}/impression`
    );
  }, [professional?._id]);

  const averageRating = 4;

  const reviewsCount = professional?.reviews?.length || 0;

  return (
    <Link to={`/professional-profile/${professional?.userId?._id || ""}`}>
      <div className={styles.professional_card}>
        {showCoverImage === false ? null : (
          <img
            className={styles.portfolioImage}
            width={400}
            height={150}
            src={professional?.portfolio[0]}
            alt={`${professional?.serviceType || "Service"} Portfolio`}
          />
        )}
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
              <p className={styles.serviceType}>
                {professional?.serviceType || "Professional Service"}
              </p>
            </div>
          </div>

          <div className={styles.stats}>
            <p className={styles.experience}>
              {Math.floor(Math.random() * 15)} years experience
            </p>
            <p className={styles.rating}>
              ⭐ {averageRating.toFixed(1)} ({reviewsCount} reviews)
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
    _id: PropTypes.string,
    serviceType: PropTypes.oneOf([
      "Architect",
      "Interior Designer",
      "Contractor",
      "Plumber",
      "Painter",
      "Electrician",
      "3D Modeler",
      "Material Supplier",
    ]),
    yearsExperience: PropTypes.number,
    portfolio: PropTypes.arrayOf(PropTypes.string),
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        rating: PropTypes.number,
      })
    ),
    id: PropTypes.string,
    userId: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      profilePictureUrl: PropTypes.string,
      coverPictureUrl: PropTypes.string,
    }),
  }),
};

ProfessionalCard.defaultProps = {
  professional: {
    _id: "",
    serviceType: "Professional Service",
    yearsExperience: 0,
    portfolio: [],
    reviews: [],
    userId: {
      _id: "",
      name: "Professional",
      profilePictureUrl: "https://via.placeholder.com/60",
      coverPictureUrl: "https://via.placeholder.com/400x150",
    },
  },
};
