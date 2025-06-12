import { useEffect, useState } from "react";
import styles from "./styles/supplierHome.module.scss";
import ListingCard from "../../components/listingCard/listingCard";
import { useAuth } from "../../contexts/authContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaPencilAlt, FaStar } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";

const StarRating = ({ rating }) => {
  return (
    <div className={styles.starRating}>
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          className={index < rating ? styles.starFilled : styles.starEmpty}
        />
      ))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

const SupplierHome = () => {
  const { currentUser } = useAuth();
  const { supplierId } = useParams();
  const queryClient = useQueryClient();
  const isOwner = currentUser.supplierProfileId === supplierId;
  const [editMode, setEditMode] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    businessDescription: "",
    phone: "",
    address: "",
    businessType: "",
    email: "",
  });

  const {
    data: supplierData,
    isLoading: isLoadingSupplier,
    isError: isSupplierError,
  } = useQuery({
    queryKey: [
      "supplier",
      isOwner ? currentUser.supplierProfileId : supplierId,
    ],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/supplier/getSupplier/${
          isOwner ? currentUser.supplierProfileId : supplierId
        }`
      );
      return res.data;
    },
    onSuccess: (data) => {
      setFormData({
        businessName: data?.businessName || "",
        businessDescription: data?.businessDescription || "",
        phone: data?.contact?.phone || "",
        address: data?.address || "",
        businessType: data?.businessType || "",
        email: data?.contact?.email || "",
      });

      if (isOwner && !data?.businessName) {
        setShowProfileDialog(true);
        console.log("Business Name: ", data?.businessName);
        setEditMode(true);
      }
    },
  });

  const { data: listings = [], isLoading: isLoadingListings } = useQuery({
    queryKey: ["listings", supplierId],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/supplier/listings/${supplierId}`
      );
      return response.data;
    },
  });

  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ["supplier-reviews", supplierId],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/supplier/reviews/${supplierId}`
      );
      return response.data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/supplier/update-profile/${supplierId}`,
        { formData }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["supplier"]);
      setEditMode(false);
      setShowProfileDialog(false);
    },
  });

  const uploadLogoMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("logo", file);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/supplier/logo/${supplierId}`,
        formData
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["supplier"]);
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Supplier Home";
  }, []);

  const handleEditToggle = () => {
    if (!editMode) {
      setFormData({
        businessName: supplierData?.businessName || "",
        businessDescription: supplierData?.businessDescription || "",
        phone: supplierData?.contact?.phone || "",
        address: supplierData?.address || "",
        businessType: supplierData?.businessType || "",
        email: supplierData?.contact?.email || "",
      });
    }
    setEditMode(!editMode);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadLogoMutation.mutate(file);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  if (isLoadingSupplier) {
    return <div className={styles.loading}>Loading supplier profile...</div>;
  }

  if (isSupplierError) {
    return <div className={styles.error}>Error loading supplier profile</div>;
  }

  return (
    <div className={styles.supplierHomepage}>
      {showProfileDialog && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialogContainer}>
            <div className={styles.dialogHeader}>
              <h2>Complete Your Supplier Profile</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowProfileDialog(false)}
              >
                &times;
              </button>
            </div>
            <div className={styles.dialogContent}>
              <div className={styles.dialogForm}>
                <div className={styles.formGroup}>
                  <label>Business Name</label>
                  <input
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter your business name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Business Type</label>
                  <select
                    value={formData.businessType}
                    name="businessType"
                    onChange={handleChange}
                  >
                    <option value="">Select business type</option>
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Retailer">Retailer</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Business Description</label>
                  <textarea
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleChange}
                    placeholder="Describe your business"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Phone</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="+92312-3456789"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Address</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter your business address"
                  />
                </div>
              </div>
            </div>
            <div className={styles.dialogActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowProfileDialog(false)}
              >
                Cancel
              </button>
              <button className={styles.saveButton} onClick={handleSave}>
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.logoAndBrandingContainer}>
          <div className={styles.brandingWrapper}>
            <div className={styles.logoContainer}>
              {editMode && (
                <label className={styles.logoInputLabel} htmlFor="logo">
                  <FaPencilAlt />
                  <input
                    hidden
                    id="logo"
                    className={styles.logoInputIcon}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
              <img src={supplierData?.logo} alt="Supplier Logo" />
            </div>
            <div className={styles.branding}>
              {!editMode ? (
                <h1>{supplierData?.businessName}</h1>
              ) : (
                <input
                  name="businessName"
                  className={styles.businessNameInput}
                  onChange={handleChange}
                  value={formData.businessName}
                  type="text"
                />
              )}
              <div className={styles.businessTypeAndRating}>
                {!editMode ? (
                  <span className={styles.businessType}>
                    {supplierData?.businessType}
                  </span>
                ) : (
                  <select
                    className={styles.businessTypeSelector}
                    value={formData.businessType}
                    name="businessType"
                    onChange={handleChange}
                  >
                    <option>Manufacturer</option>
                    <option>Distributor</option>
                    <option>Retailer</option>
                  </select>
                )}
                <span className={styles.rating}>★ {supplierData?.rating}</span>
              </div>
            </div>
          </div>
          <div className={styles.actionButtonsContainer}>
            {!isOwner ? (
              <button>Chat Now</button>
            ) : (
              <>
                {editMode && <button onClick={handleSave}>Save</button>}
                <button onClick={handleEditToggle}>
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.businessInfoGrid}>
          <div className={styles.businessDescriptionContainer}>
            <h3>About</h3>
            {!editMode ? (
              <p>
                {supplierData?.businessDescription || "No description added"}
              </p>
            ) : (
              <textarea
                name="businessDescription"
                className={styles.businessDescriptionTextarea}
                value={formData.businessDescription}
                onChange={handleChange}
              />
            )}
          </div>

          <div className={styles.addressAndContactContainer}>
            <div className={styles.contactContainer}>
              <div className={styles.contactInfo}>
                <h3>Contact</h3>
                {!editMode ? (
                  <p>
                    Phone:{" "}
                    {supplierData?.contact?.phone || "No phone number added"}{" "}
                  </p>
                ) : (
                  <div className={styles.contactItemWrapper}>
                    <p>Phone:</p>
                    <input
                      className={styles.contactInput}
                      name="phone"
                      onChange={handleChange}
                      placeholder="+92312-3456789"
                      type="tel"
                      value={formData.phone}
                    />
                  </div>
                )}
                {!editMode ? (
                  <p>
                    Email: {supplierData?.contact?.email || "No email added"}
                  </p>
                ) : (
                  <div className={styles.contactItemWrapper}>
                    <p>Email: </p>
                    <input
                      className={styles.emailInput}
                      name="email"
                      onChange={handleChange}
                      placeholder="Enter your email"
                      value={formData.email}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.addressContainer}>
              <h3>Address</h3>
              {!editMode ? (
                <p>{supplierData?.address || "No address added"}</p>
              ) : (
                <input
                  className={styles.addressInput}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              )}
            </div>
          </div>
        </div>

        <div className={styles.listingsContainer}>
          <h3>Listings</h3>
          <div className={styles.mainListingsContainer}>
            {isLoadingListings ? (
              <p>Loading listings...</p>
            ) : listings.length > 0 ? (
              listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))
            ) : (
              <p>No listings yet</p>
            )}
          </div>
        </div>

        <div className={styles.reviewsContainer}>
          <h3>Reviews</h3>
          {isLoadingReviews ? (
            <p>Loading reviews...</p>
          ) : reviews.length > 0 ? (
            <div className={styles.reviewsList}>
              {reviews.map((review, index) => (
                <div key={index} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      {review.user?.profilePictureUrl ? (
                        <img
                          src={review.user.profilePictureUrl}
                          alt={review.user.name}
                          className={styles.reviewerImage}
                        />
                      ) : (
                        <div className={styles.reviewerInitial}>
                          {review.user?.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <span className={styles.reviewerName}>
                        {review.user?.name || "Anonymous"}
                      </span>
                    </div>
                    <div className={styles.reviewRating}>
                      <StarRating rating={review.rating} />
                      <span className={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className={styles.reviewComment}>{review.comment}</p>
                  {review.image && (
                    <img
                      src={review.image}
                      alt="Review"
                      className={styles.reviewImage}
                      onClick={() => window.open(review.image, "_blank")}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet</p>
          )}
        </div>
      </header>
    </div>
  );
};

export default SupplierHome;
