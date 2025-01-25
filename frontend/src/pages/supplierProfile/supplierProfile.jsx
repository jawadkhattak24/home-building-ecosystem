import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "redaxios";
import { useLoading } from "../../contexts/loadingContext";
import styles from "./styles/supplierProfile.module.scss";


import {
  FaStar,
  FaRegStar,
  FaMapMarkerAlt,
  FaBox,
  FaStore,
  FaTruck,
} from "react-icons/fa";

const ViewSupplierProfile = () => {
  const { userId } = useParams();
  const [supplierData, setSupplierData] = useState(null);
  const [userData, setUserData] = useState(null);
  const { isLoading, setIsLoading, LoadingUI } = useLoading();

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const supplierResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/supplier-profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSupplierData(supplierResponse.data);
        setUserData(supplierResponse.data.userId);
        console.log("supplierResponse.data", supplierResponse.data);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupplierData();
  }, [userId, setIsLoading]);

  if (!supplierData || !userData) {
    return <LoadingUI />;
  }

  const {
    businessName,
    businessType,
    productCategories,
    additionalDetails,
    rating,
    reviews,
    deliveryAreas,
    featuredProducts,
  } = supplierData;

  const { name, profilePictureUrl, coverPictureUrl } = userData;

  return (
    <div className={styles.viewSupplierProfile}>
      <div
        className={styles.coverImage}
        style={{ backgroundImage: `url(${userData.coverPictureUrl})` }}
      />

      <div className={styles.profileContent}>
        <div className={styles.profileHeader}>
          <img
            src={profilePictureUrl}
            alt={businessName}
            className={styles.profilePicture}
          />
          <div className={styles.headerInfo}>
            <h1>{businessName}</h1>
            {/* <h2>{businessType}</h2> */}
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
              <h3>About Business</h3>
              <p>{additionalDetails}</p>
            </div>

            {/* <div className={styles.infoCard}>
              <h3>Product Categories</h3>
              {productCategories.map((category, index) => (
                <div key={index} className={styles.categoryItem}>
                  <FaBox />
                  <span>{category}</span>
                </div>
              ))}
            </div> */}

            {/* <div className={styles.infoCard}>
              <h3>Featured Products</h3>
              <div className={styles.productsGrid}>
                {featuredProducts.map((product, index) => (
                  <div key={index} className={styles.productItem}>
                    <img src={product.image} alt={product.name} />
                    <h4>{product.name}</h4>
                    <p>{product.price}</p>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          <div className={styles.rightSection}>
            <button className={styles.contactButton}>Contact Supplier</button>

            {/* <div className={styles.infoCard}>
              <h3>Delivery Areas</h3>
              {deliveryAreas.map((area, index) => (
                <div key={index} className={styles.areaItem}>
                  <FaTruck />
                  <span>{area}</span>
                </div>
              ))}
            </div> */}

            {/* <div className={styles.reviewsSection}>
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
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSupplierProfile;
