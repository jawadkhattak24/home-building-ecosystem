import { Link } from "react-router-dom";
import styles from "./styles/listingCard.module.scss";

const ListingCard = ({ listing }) => {
  console.log(listing);

  const toCapitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Link to={`/listing/${listing._id}`}>
      <div className={styles.listingCard}>
        <div className={styles.imageContainer}>
          <img src={listing.images[0]} alt={listing.name} />
          {listing.rating > 0 && (
            <div className={styles.ratingBadge}>
              ⭐ {listing.rating.toFixed(1)}
            </div>
          )}
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardHeader}>
            <div className={styles.titleSection}>
              <h3>{listing.name}</h3>
              {listing.brand && (
                <span className={styles.brandName}>{listing.brand}</span>
              )}
            </div>
            <span className={styles.categoryTag}>
              {toCapitalize(listing.category)}
            </span>
          </div>

          {/* {listing.description && (
            <p className={styles.description}>{listing.description}</p>
          )} */}

          <div className={styles.priceSection}>
            <div className={styles.mainPrice}>
              <span className={styles.priceValue}>
                {listing.price.currency} {listing.price.value.toLocaleString()}
              </span>
              <span className={styles.priceUnit}>/{listing.price.unit}</span>
            </div>
            {listing.stock > 0 && (
              <span className={styles.stockCount}>
                {listing.stock} units available
              </span>
            )}
          </div>

          <div className={styles.statusSection}>
            <span
              className={`${styles.availabilityTag} ${
                styles[listing.availability]
              }`}
            >
              {toCapitalize(listing.availability.replace(/_/g, " "))}
            </span>
            {listing.certifications?.length > 0 && (
              <div className={styles.certifications}>
                🏅 {listing.certifications.join(", ")}
              </div>
            )}
          </div>

          {/* <button className={styles.editButton}>Edit Listing</button> */}
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
