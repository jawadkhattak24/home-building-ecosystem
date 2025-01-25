import styles from "./styles/listingCard.module.scss";

const ListingCard = ({ listing }) => {
  console.log(listing);

  const toCapitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <div className={styles.listingCard}>
        <div className={styles.imageContainer}>
          <img src={listing.images[0]} alt={listing.name} />
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardHeader}>
            <h3>{listing.name}</h3>
            <span className={styles.categoryTag}>
              {toCapitalize(listing.category)}
            </span>
          </div>

          <div className={styles.priceSection}>
            <span className={styles.priceValue}>PKR {listing.price.value}</span>
            <span className={styles.priceUnit}>/{listing.price.unit}</span>
          </div>

          <div className={styles.stockInfo}>
            <span>Stock:</span>
            <span>{listing.availability}</span>
          </div>

          <button className={styles.editButton}>Edit Listing</button>
        </div>
      </div>
    </>
  );
};

export default ListingCard;
