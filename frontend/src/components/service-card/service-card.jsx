import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "redaxios";
import styles from "./styles/service-card.module.scss";
import PropTypes from "prop-types";

function ProfessionalCard({ professional }) {
  console.log("Pro", professional);

  const { name, profilePictureUrl, coverPictureUrl } =
    professional?.userId || professional?.id || {};

  // useEffect(() => {
  //   console.log("Profile Picture URL:", profilePictureUrl);
  //   console.log("Cover Picture URL:", coverPictureUrl);
  // }, [profilePictureUrl, coverPictureUrl]);

  // Simplified averageRating
  const averageRating = 4;

  // Safe access to reviews length
  const reviewsCount = professional?.reviews?.length || 0;

  return (
    <Link to={`/professional-profile/${professional?.userId?._id || ""}`}>
      <div className={styles.professional_card}>
        <img
          className={styles.portfolioImage}
          width={400}
          height={150}
          src={coverPictureUrl}
          alt={`${professional?.serviceType || "Service"} Portfolio`}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x150";
          }}
        />
        <div className={styles.cardDetails}>
          <div className={styles.professionalInfo}>
            <img
              className={styles.profileImage}
              width={60}
              height={60}
              src={profilePictureUrl}
              alt={name}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/60";
              }}
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
              {professional?.yearsExperience || 0} years experience
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

// Default props
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
