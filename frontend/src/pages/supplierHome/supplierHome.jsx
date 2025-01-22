import { useState } from "react";
import styles from "./styles/supplierHome.module.scss";
import ListingForm from "../../components/listingForm/listingForm";
import ListingCard from "../../components/listingCard/listingCard";

const SupplierHome = () => {
  const [showListingForm, setShowListingForm] = useState(false);
  // const [listings, setListings] = useState([]);

  const listings = [
    {
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
    },

    {
      name: "Tiles",
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
    },
  ];

  const supplierData = {
    businessName: "BuildMaster Materials",
    rating: 4.5,
    coverImage:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    businessType: "Retailer",
    businessDescription:
      "BuildMaster Materials is a leading supplier of building materials, offering a wide range of products to meet the needs of the construction industry. We are a family-owned business that has been serving the community for over 50 years. We provide high quality products and services to our customers. We are committed to providing the best possible experience for our customers. ",
    totalListings: 12,
    availableStock: 4580,
    contact: {
      phone: "0300-1234567",
      email: "info@buildmaster.com",
      socialMedia: {
        facebook: "https://www.facebook.com/buildmaster",
        linkedin: "https://www.linkedin.com/company/buildmaster",
        instagram: "https://www.instagram.com/buildmaster",
      },
    },
    address: {
      street: "123 Main St",
      city: "Karachi",
      state: "Sindh",
      country: "Pakistan",
    },
  };

  const handleCreateListing = (newListing) => {
    // setListings([...listings, newListing]);
    setShowListingForm(false);
  };

  return (
    <div className={styles.supplierHomepage}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.coverImageContainer}>
            <img
              className={styles.coverImage}
              src={supplierData.coverImage}
              alt="Supplier Cover"
            />
          </div>
          <div className={styles.logoAndBrandingContainer}>
            <div className={styles.logoContainer}>
              <img src={supplierData.logo} alt="Supplier Logo" />
            </div>
            <div className={styles.branding}>
              <h1>{supplierData.businessName}</h1>
              <div className={styles.businessTypeAndRating}>
                <span className={styles.businessType}>
                  {supplierData.businessType}
                </span>
                <span className={styles.rating}>★ {supplierData.rating}</span>
              </div>
            </div>
          </div>
        </div>
        {/* <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            onClick={() => setShowListingForm(true)}
          >
            + New Listing
          </button>
        </div> */}

        <div className={styles.businessInfoGrid}>
          <div className={styles.businessDescriptionContainer}>
            <h3>About</h3>
            <p>{supplierData.businessDescription}</p>
          </div>

          <div className={styles.addressAndContactContainer}>
            <div className={styles.contactContainer}>
              <div className={styles.contactInfo}>
                <h3>Contact</h3>
                <p>Phone: {supplierData.contact.phone}</p>
                <p>Email: {supplierData.contact.email}</p>
                {/* <div className={styles.socialMedia}>
                <a href={supplierData.contact.socialMedia.facebook}>Facebook</a>
                <a href={supplierData.contact.socialMedia.linkedin}>LinkedIn</a>
                <a href={supplierData.contact.socialMedia.instagram}>
                  Instagram
                </a>
                </div> */}
              </div>
            </div>
            <div className={styles.addressContainer}>
              <h3>Address</h3>
              <p>
                {supplierData.address.street} {supplierData.address.city},{" "}
                {supplierData.address.state} {supplierData.address.country}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.reviewsContainer}>
          <h3>Reviews</h3>
          <p>No reviews yet</p>
        </div>

        <div className={styles.listingsContainer}>
          <h3>Listings</h3>
          <p>No listings yet</p>
        </div>
      </header>

      {/* <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Listings</h3>
          <p>{supplierData.totalListings}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Available Stock</h3>
          <p>{supplierData.availableStock}</p>
        </div>
        <div className={styles.statCard}>
          <h3>New Messages</h3>
          <p>3</p>
        </div>
      </div>

      <div className={styles.listingsGrid}>
        {listings.map((listing, index) => (
          <ListingCard key={index} listing={listing} />
        ))}
      </div>

      {showListingForm && (
        <ListingForm
          onClose={() => setShowListingForm(false)}
          onSubmit={handleCreateListing}
        />
      )} */}
    </div>
  );
};

export default SupplierHome;
