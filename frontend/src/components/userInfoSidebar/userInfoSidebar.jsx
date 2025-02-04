import { Link } from "react-router-dom";
import styles from "./styles/userInfoSidebar.module.scss";
import UserInfoSidebarSkeleton from "./loadingSkeleton/userInfoSidebarSkeleton";

const UserInfoSidebar = ({ otherUser }) => {
  if (!otherUser) {
    return <UserInfoSidebarSkeleton />;
  }

  const {
    name,
    serviceType,
    profilePictureUrl,
    rating,
    ratePerHour,
    yearsExperience = 7,
    bio,
    reviews = []
  } = otherUser;

  const truncatedBio = bio?.slice(0, 120) + (bio?.length > 120 ? '...' : '');
  const reviewCount = reviews?.length;

  return (
    <div className={styles.userInfoSidebar}>
      <div className={styles.header}>
        <div className={styles.profilePhoto}>
          <img
            src={profilePictureUrl}
            alt={name}
            className={styles.profilePicture}
          />
        </div>
        <div className={styles.userInfo}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.serviceType}>{serviceType}</p>
          <div className={styles.details}>
            <div className={styles.rating}>
              <span>⭐ {rating}</span>
              <span className={styles.reviewsCount}>({reviewCount} reviews)</span>
            </div>
            <div className={styles.rate}>
              <span>${ratePerHour}/h</span>
              <span className={styles.experience}>• {yearsExperience} yrs exp</span>
            </div>
          </div>
          <p className={styles.bio}>{truncatedBio || 'No bio provided'}</p>

        </div>
      </div>
      <div className={styles.cta}>
        <Link to={`/professional-profile/${otherUser.userId}`} className={styles.button}>
          View Full Profile
        </Link>
      </div>
    </div>
  );
};

export default UserInfoSidebar;