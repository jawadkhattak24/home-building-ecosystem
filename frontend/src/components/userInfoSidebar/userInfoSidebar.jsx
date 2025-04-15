import { Link } from "react-router-dom";
import styles from "./styles/userInfoSidebar.module.scss";
import UserInfoSidebarSkeleton from "./loadingSkeleton/userInfoSidebarSkeleton";

const UserInfoSidebar = ({ otherUser }) => {
  if (!otherUser) {
    return <UserInfoSidebarSkeleton />;
  }

  console.log("otherUser in userInfoSidebar", otherUser);

  const {
    name,
    businessName,
    businessDescription,
    serviceType,
    profilePictureUrl,
    logo,
    rating,
    ratePerHour,
    yearsExperience = 7,
    bio,
    reviews = [],
  } = otherUser;

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };
  const truncatedBusinessDescription =
    businessDescription?.slice(0, 120) +
    (businessDescription?.length > 120 ? "..." : "");
  const truncatedBio = bio?.slice(0, 120) + (bio?.length > 120 ? "..." : "");
  const reviewCount = reviews?.length;

  console.log("otherUser in userInfoSidebar", otherUser);

  return (
    <div className={styles.userInfoSidebar}>
      <div className={styles.header}>
        <div className={styles.profilePhoto}>
          <img
            src={otherUser.userType === "supplier" ? logo : profilePictureUrl}
            alt={name}
            className={styles.profilePicture}
          />
        </div>
        <div className={styles.userInfo}>
          <h3 className={styles.name}>
            {otherUser.userType === "supplier"
              ? otherUser.businessName
              : otherUser.name || "Unknown User"}
          </h3>

          {otherUser.userType === "homeowner" && (
            <p className={styles.createdAt}>
              Joined {formatDate(otherUser.createdAt)}
            </p>
          )}

          <p className={styles.serviceType}>
            {otherUser.userType === "homeowner" && "Homeowner"}
            {otherUser.userType === "supplier"
              ? otherUser.businessType
              : serviceType}
          </p>

          {otherUser.userType === "supplier" ||
            (otherUser.userType === "professional" && (
              <div className={styles.details}>
                <div className={styles.rating}>
                  <span>⭐ {rating}</span>
                  <span className={styles.reviewsCount}>
                    ({reviewCount} reviews)
                  </span>
                </div>
                <div className={styles.rate}>
                  <span>${ratePerHour}/h</span>
                  <span className={styles.experience}>
                    {yearsExperience} YOE
                  </span>
                </div>
              </div>
            ))}
          {otherUser.userType === "supplier" ||
            (otherUser.userType === "professional" && (
              <p className={styles.bio}>
                {otherUser.userType === "supplier"
                  ? truncatedBusinessDescription
                  : truncatedBio || "No bio provided"}
              </p>
            ))}
        </div>
      </div>
      <div className={styles.cta}>
        <Link
          to={
            otherUser.userType === "supplier"
              ? `/supplier-profile/${otherUser._id}`
              : otherUser.userType === "homeowner"
              ? `/homeowner-profile/${otherUser._id}`
              : `/professional-profile/${otherUser.userId}`
          }
          className={styles.button}
        >
          View Full Profile
        </Link>
      </div>
    </div>
  );
};

export default UserInfoSidebar;
