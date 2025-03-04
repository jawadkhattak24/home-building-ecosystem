import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../contexts/authContext";
import ListingCard from "../../components/listingCard/listingCard";
import ListingForm from "../../components/listingForm/listingForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./styles/supplierListings.module.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEllipsisV } from "react-icons/fa";

export default function SupplierListings() {
  const { currentUser } = useAuth();
  const currentUserId = currentUser._id || currentUser.id;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    availability: [],
  });
  const queryClient = useQueryClient();
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const navigate = useNavigate();
  const [editingListing, setEditingListing] = useState(null);

  const {
    data: listings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["supplierListings", currentUserId],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/supplier/listings/${currentUserId}`
      );
      return response.data;
    },
  });

  const addListingMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/supplier/listing`,
        { ...formData, userId: currentUserId }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supplierListings", currentUserId],
      });
      setIsFormOpen(false);
    },
    onError: (error) => {
      console.error("Error submitting listing:", error);
    },
  });

  const updateListingMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/supplier/listing/${formData._id}`,
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supplierListings", currentUserId],
      });
      setIsFormOpen(false);
      setEditingListing(null);
    },
    onError: (error) => {
      console.error("Error updating listing:", error);
    },
  });

  const handleFilterCheckboxChange = (e, filterType) => {
    const value = e.target.id;
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: e.target.checked
        ? [...prev[filterType], value]
        : prev[filterType].filter((item) => item !== value),
    }));
  };

  useEffect(() => {
    document.title = "Supplier Listings";
    window.scrollTo(0, 0);
  }, []);

  const handleListingSubmit = async (formData) => {
    console.log(formData);
    if (editingListing) {
      updateListingMutation.mutate(formData);
    } else {
      addListingMutation.mutate(formData);
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

  const filteredListings = listings.filter((listing) => {
    const categoryMatch =
      selectedFilters.category.length === 0 ||
      selectedFilters.category.includes(listing.category);
    const availabilityMatch =
      selectedFilters.availability.length === 0 ||
      selectedFilters.availability.includes(listing.availability);
    return categoryMatch && availabilityMatch;
  });

  const handleActionMenuToggle = (listingId) => {
    setOpenActionMenuId(openActionMenuId === listingId ? null : listingId);
  };

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);

  const deleteListingMutation = useMutation({
    mutationFn: async (listingId) => {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/supplier/listing/${listingId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supplierListings", currentUserId],
      });
      setShowDeleteConfirmation(false);
      setListingToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting listing:", error);
    },
  });

  const handleActionSelect = (action, listingId) => {
    console.log(`Action ${action} selected for listing ${listingId}`);

    if (action === "delete") {
      setShowDeleteConfirmation(true);
      setListingToDelete(listingId);
    } else if (action === "edit") {
      const listingToEdit = listings.find(
        (listing) => listing._id === listingId
      );
      setEditingListing(listingToEdit);
      setIsFormOpen(true);
    } else if (action === "view") {
      navigate(`/listing/${listingId}`);
    }

    setOpenActionMenuId(null);
  };

  const actionMenuRef = useRef(null);

  const handleClickOutside = (e) => {
    if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
      setOpenActionMenuId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.supplierListingsContainer}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Listings</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          disabled={addListingMutation.isPending}
        >
          {addListingMutation.isPending ? "Adding..." : "Add Listing"}
        </button>
      </div>

      <div className={styles.sidebarAndListingsContainer}>
        <div
          className={`${styles.sidebar} ${
            Object.values(selectedFilters).some((arr) => arr.length > 0)
              ? styles.filterApplied
              : ""
          }`}
        >
          <h2>Filter</h2>
          <div className={styles.filterContainer}>
            <div className={styles.filterItem}>
              <h3 className={styles.filterItemTitle}>Category</h3>
              <div className={styles.categoryContainer}>
                {[...new Set(listings.map((listing) => listing.category))].map(
                  (category) => (
                    <div className={styles.categoryItem} key={category}>
                      <input
                        onChange={(e) =>
                          handleFilterCheckboxChange(e, "category")
                        }
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
                {[
                  ...new Set(listings.map((listing) => listing.availability)),
                ].map((availability) => (
                  <div className={styles.stockItem} key={availability}>
                    <input
                      className={styles.filterCheckbox}
                      onChange={(e) =>
                        handleFilterCheckboxChange(e, "availability")
                      }
                      type="checkbox"
                      id={availability}
                      checked={selectedFilters.availability.includes(
                        availability
                      )}
                    />
                    <label htmlFor={availability}>
                      {capitalize(availability) +
                        " " +
                        "(" +
                        countItems(listings, "availability", availability) +
                        ")"}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.listingsContainer}>
          {isLoading && <div>Loading listings...</div>}
          {isError && <div>Error loading listings: {error.message}</div>}
          {filteredListings.length > 0 && (
            <div className={styles.analyticsLabelContainer}>
              <div className={styles.analyticsLabel}>
                <p>Impressions</p>
                <p>Clicks</p>
                <p>Click Rate</p>
                <p>Favorites</p>
              </div>
            </div>
          )}
          {!isLoading && !isError && listings.length === 0 && <PlaceholderUI />}
          {!isLoading &&
            !isError &&
            filteredListings.length > 0 &&
            filteredListings.map((listing) => (
              <>
                <div className={styles.listingCardContainer} key={listing._id}>
                  <div className={styles.listingCardHeader}>
                    <div className={styles.listingCardImageContainer}>
                      <img src={listing.images[0]} alt={listing.name} />
                    </div>
                    <h3 className={styles.listingCardTitle}>{listing.name}</h3>
                  </div>
                  <div className={styles.listingCardStatsContainer}>
                    <div className={styles.listingCardStats}>
                      <p className={styles.listingCardStatsItem}>
                        {listing.analytics.impressions}
                      </p>
                      <p className={styles.listingCardStatsItem}>
                        {listing.analytics.clicks}
                      </p>
                      <p className={styles.listingCardStatsItem}>
                        {(
                          (listing.analytics.clicks /
                            listing.analytics.impressions) *
                          100
                        ).toFixed(0)}
                        %
                      </p>
                      <p className={styles.listingCardStatsItem}>
                        {listing.analytics.favorites}
                      </p>
                    </div>

                    <div className={styles.actionsButtonsContainer}>
                      <button
                        className={styles.actionMenuButton}
                        onClick={() => handleActionMenuToggle(listing._id)}
                        aria-label="Listing actions"
                      >
                        <FaEllipsisV />
                      </button>
                      {openActionMenuId === listing._id && (
                        <div
                          className={styles.actionMenuDropdown}
                          ref={actionMenuRef}
                        >
                          <button
                            className={styles.actionMenuItem}
                            onClick={() =>
                              handleActionSelect("view", listing._id)
                            }
                          >
                            View
                          </button>
                          <button
                            className={styles.actionMenuItem}
                            onClick={() =>
                              handleActionSelect("edit", listing._id)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className={styles.actionMenuItem}
                            onClick={() =>
                              handleActionSelect("delete", listing._id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {showDeleteConfirmation && (
                    <div className={styles.deleteConfirmationContainer}>
                      <div className={styles.deleteConfirmation}>
                        <p>Are you sure you want to delete this listing?</p>
                        <div className={styles.deleteConfirmationButtons}>
                          <button
                            className={styles.deleteConfirmationButton}
                            onClick={() => {
                              deleteListingMutation.mutate(listingToDelete, {
                                onSuccess: () => {
                                  queryClient.invalidateQueries({
                                    queryKey: [
                                      "supplierListings",
                                      currentUserId,
                                    ],
                                  });
                                  setShowDeleteConfirmation(false);
                                  setListingToDelete(null);
                                },
                              });
                            }}
                          >
                            Delete
                          </button>
                          <button
                            className={styles.cancelDeleteButton}
                            onClick={() => {
                              setShowDeleteConfirmation(false);
                              setListingToDelete(null);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ))}
        </div>
      </div>

      {isFormOpen && (
        <ListingForm
          onClose={() => {
            setIsFormOpen(false);
            setEditingListing(null);
          }}
          onSubmit={handleListingSubmit}
          isSubmitting={
            editingListing
              ? updateListingMutation.isPending
              : addListingMutation.isPending
          }
          initialData={editingListing}
          isEditing={!!editingListing}
        />
      )}
    </div>
  );
}

const PlaceholderUI = () => {
  return (
    <div className={styles.placeholderUIContainer}>
      <h2>
        You don&apos;t have any listing yet. <br /> Create one by clicking the
        &quot;Add Listing&quot; button.
      </h2>
    </div>
  );
};
