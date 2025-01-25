import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import ListingCard from "../../components/listingCard/listingCard";
import ListingForm from "../../components/listingForm/listingForm";
import axios from "axios";
import styles from "./styles/supplierListings.module.scss";

export default function SupplierListings() {
  const { currentUser } = useAuth();
  const currentUserId = currentUser._id || currentUser.id;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    availability: []
  });

  const handleFilterCheckboxChange = (e, filterType) => {
    const value = e.target.id;
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: e.target.checked 
        ? [...prev[filterType], value]
        : prev[filterType].filter(item => item !== value)
    }));
  };

  useEffect(() => {
    document.title = "Supplier Listings";
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/supplier/listings/${currentUserId}`
      );
      setListings(response.data);
    };
    fetchListings();
  }, [currentUserId]);
  const handleListingSubmit = async (formData) => {
    console.log(formData);
    setIsFormOpen(false);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/supplier/listing`,
        { ...formData, userId: currentUserId }
      );
      console.log(response);
    } catch (error) {
      console.error("Error submitting listing:", error);
    }
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const countItems = (arr, filter, name) => {
    console.log(arr, filter, name);
    console.log("Items:", arr.filter((item) => item[filter] === name).length);
    return arr.filter((item) => item[filter] === name).length;
  };

  const filteredListings = listings.filter(listing => {
    const categoryMatch = selectedFilters.category.length === 0 || 
      selectedFilters.category.includes(listing.category);
    const availabilityMatch = selectedFilters.availability.length === 0 || 
      selectedFilters.availability.includes(listing.availability);
    return categoryMatch && availabilityMatch;
  });

  return (
    <div className={styles.supplierListingsContainer}>
      <h1 className={styles.title}>Your Listings</h1>
      <div className={styles.sidebarAndListingsContainer}>
        <div className={`${styles.sidebar} ${
          Object.values(selectedFilters).some(arr => arr.length > 0) ? styles.filterApplied : ""
        }`}>
          <h2>Filter</h2>
          <div className={styles.filterContainer}>
            <div className={styles.filterItem}>
              <h3 className={styles.filterItemTitle}>Category</h3>
              <div className={styles.categoryContainer}>
                {[...new Set(listings.map((listing) => listing.category))].map(
                  (category) => (
                    <div className={styles.categoryItem} key={category}>
                      <input
                        onChange={(e) => handleFilterCheckboxChange(e, 'category')}
                        className={styles.filterCheckbox}
                        type="checkbox"
                        id={category}
                        checked={selectedFilters.category.includes(category)}
                      />
                      <label htmlFor={category}>
                        {capitalize(category) +
                          " " +
                          "(" +
                          countItems(listings, "category", category) +
                          ")"}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className={styles.filterItem}>
              <h3 className={styles.filterItemTitle}>Stock</h3>
              <div className={styles.stockContainer}>
                {[...new Set(listings.map((listing) => listing.availability))].map(
                  (availability) => (
                    <div className={styles.stockItem} key={availability}>
                      <input
                        className={styles.filterCheckbox}
                        onChange={(e) => handleFilterCheckboxChange(e, 'availability')}
                        type="checkbox"
                        id={availability}
                        checked={selectedFilters.availability.includes(availability)}
                      />
                      <label htmlFor={availability}>
                        {capitalize(availability) +
                          " " +
                          "(" +
                          countItems(listings, "availability", availability) +
                          ")"}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.listingsContainer}>
          {filteredListings.length > 0 &&
            filteredListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
        </div>
      </div>
      <button onClick={() => setIsFormOpen(true)}>Add Listing</button>

      {isFormOpen && (
        <ListingForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleListingSubmit}
        />
      )}
    </div>
  );
}
