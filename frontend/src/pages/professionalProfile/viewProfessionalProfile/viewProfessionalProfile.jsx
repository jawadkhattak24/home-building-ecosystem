import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "redaxios";
import PropTypes from "prop-types";
import { useLoading } from "../../../contexts/loadingContext";
import styles from "./styles/viewProfessionalProfile.module.scss";

import {
  FaStar,
  FaRegStar,
  FaMapMarkerAlt,
  FaCertificate,
  FaBriefcase,
} from "react-icons/fa";

const ViewProfessionalProfile = () => {
  const { userId } = useParams();
  const [professionalData, setProfessionalData] = useState(null);
  const [userData, setUserData] = useState(null);

  console.log("User id in viewProfessionalProfile", userId);
  const { isLoading, setIsLoading, LoadingUI } = useLoading();

  useEffect(() => {
    const fetchProfessionalData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const professionalResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/professional/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfessionalData(professionalResponse.data);

        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/user/${
            professionalResponse.data.userId
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(userResponse.data);
      } catch (error) {
        console.error("Error fetching professional data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionalData();
  }, [userId, setIsLoading]);

  if (!professionalData || !userData) {
    return <LoadingUI />;
  }

  const {
    serviceType,
    yearsExperience,
    bio,
    certifications,
    portfolio,
    rating,
    reviews,
  } = professionalData;

  const { name, profilePictureUrl } = userData;

  return (
    <div className={styles.viewProfessionalProfile}>
      <div
        className={styles.coverImage}
        style={{ backgroundImage: `url(${userData.coverPictureUrl})` }}
      />

      <div className={styles.profileContent}>
        <div className={styles.profileHeader}>
          <img
            src={profilePictureUrl}
            alt={name}
            className={styles.profilePicture}
          />
          <div className={styles.headerInfo}>
            <h1>{name}</h1>
            <h2>{serviceType}</h2>
            <div className={styles.rating}>
              {[...Array(5)].map((_, index) =>
                index < Math.floor(rating) ? (
                  <FaStar key={index} className={styles.starFilled} />
                ) : (
                  <FaRegStar key={index} className={styles.starEmpty} />
                )
              )}
              <span>({rating})</span>
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.leftSection}>
            <div className={styles.infoCard}>
              <h3>About</h3>
              <p>{bio}</p>
            </div>

            <div className={styles.infoCard}>
              <h3>Experience & Certifications</h3>
              <div className={styles.experienceItem}>
                <FaBriefcase />
                <span>{yearsExperience} Years of Experience</span>
              </div>
              <div className={styles.experienceItem}>
                <FaCertificate />
                <span>{certifications}</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>Portfolio</h3>
              <div className={styles.portfolioGrid}>
                {portfolio.map((image, index) => (
                  <div key={index} className={styles.portfolioItem}>
                    <img src={image} alt={`Portfolio ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.rightSection}>
            <button className={styles.contactButton}>
              Contact Professional
            </button>

            <div className={styles.reviewsSection}>
              <h3>Reviews</h3>
              {reviews.map((review, index) => (
                <div key={index} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.rating}>
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} className={styles.starFilled} />
                      ))}
                    </div>
                    <span className={styles.reviewDate}>
                      {review.createdAt}
                    </span>
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfessionalProfile;

ViewProfessionalProfile.propTypes = {
  userId: PropTypes.string.isRequired,
};
