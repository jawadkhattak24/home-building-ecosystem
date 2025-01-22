import styles from "./styles/listingCard.module.scss";



//write an example data for the listing card
const listing = {
  name: "Cement",
  category: "Building Material",
  price: {
    value: 100,
    unit: "kg",
    currency: "PKR",
  },
  stock: {
    quantity: 100,
    availability: "In Stock",
  },
  availability: "In Stock",
};


const ListingCard = () => {
  return (
    <div className={styles.listingCard}>
      <div className={styles.cardHeader}>
        <h3>{listing.name}</h3>
        <span className={styles.categoryTag}>{listing.category}</span>
      </div>
      
      <div className={styles.priceSection}>
        <span className={styles.priceValue}>₹{listing.price.value}</span>
        <span className={styles.priceUnit}>/{listing.price.unit}</span>
      </div>

      <div className={styles.stockInfo}>
        <span>Stock:</span>
        <progress 
          value={listing.stock.quantity} 
          max="1000" 
        />
        <span>{listing.availability}</span>
      </div>

      <button className={styles.editButton}>Edit Listing</button>
    </div>
  );
};

export default ListingCard;