import { useEffect, useState } from "react";
import styles from "./styles/supplierHome.module.scss";
import ListingCard from "../../components/listingCard/listingCard";
import { useAuth } from "../../contexts/authContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";

const SupplierHome = () => {
  const { currentUser } = useAuth();
  const currentUserId = currentUser.id || currentUser._id;

  const [listings, setListings] = useState([]);

  const { supplierId } = useParams();

  const isOwner = currentUser.supplierId === supplierId;

  console.log("Is Owner: ", isOwner);

  const [supplierData, setSupplierData] = useState();

  const [logo, setLogo] = useState("");

  useEffect(() => {
    const fetchSupplierData = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/supplier/getSupplier/${
          isOwner ? currentUser.supplierId : supplierId
        }`
      );
      setSupplierData(res.data);
      setLogo(res.data.logo);
      console.log("Supplier Data: ", supplierData);
    };
    fetchSupplierData();
  }, []);

  useEffect(() => {
    document.title = "Supplier Home";
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

  const [editMode, setEditMode] = useState(false);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };
  const handleImageUpload = async (event) => {
    console.log("Well");
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("logo", file);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/supplier/logo/${supplierId}`,
        formData
      );
      console.log("Logo uploading res: ", res.data);
      setLogo(res.data);
    } catch (err) {
      console.error("An error occurred uploading the logo: ", err);
    }
  };

  const [formData, setFormData] = useState({
    businessName: "",
    businessDescription: "",
    phone: "",
    address: "",
    businessType: "",
  });

  useEffect(() => {
    if (supplierData) {
      setFormData({
        businessName: supplierData?.businessName,
        businessDescription: supplierData?.businessDescription,
        phone: supplierData?.contact?.phone,
        address: supplierData?.address,
        businessType: supplierData?.businessName,
      });
    }
  }, [supplierData, logo]);

  console.log("Form Data: ", formData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const [notification, setNotification] = useState("");

  const handleSave = async () => {
    console.log("Form Data: ", formData);
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/supplier/update-profile/${supplierId}`,
        { formData: formData }
      );

      if (response.status === 201) {
        setNotification("Profile updated successfully");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className={styles.supplierHomepage}>
      <header className={styles.header}>
        {/*<div className={styles.coverImageContainer}>*/}
        {/*    <img*/}
        {/*        className={styles.coverImage}*/}
        {/*        src={supplierData.coverImage}*/}
        {/*        alt="Supplier Cover"*/}
        {/*    />*/}

        {/*    {editMode && (*/}
        {/*        <label htmlFor="coverImage" className={styles.editCoverImageIcon}>*/}
        {/*            <FaPencilAlt/>*/}

        {/*            <input hidden type="file" accept="image/*" className={styles.coverImageInput}*/}
        {/*                   onChange={handleImageUpload}/>*/}
        {/*        </label>*/}
        {/*    )}*/}
        {/*</div>*/}
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
              <img src={logo} alt="Supplier Logo" />
            </div>
            <div className={styles.branding}>
              {!editMode ? (
                <h1>{supplierData?.businessName}</h1>
              ) : (
                <input
                  name="businessName"
                  className={styles.businessNameInput}
                  onChange={handleChange}
                  value={formData?.businessName}
                  type=" text"
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
            {(editMode && !isOwner) || (isOwner && !editMode) ? (
              <p>{supplierData?.businessDescription}</p>
            ) : editMode ? (
              <textarea
                name="businessDescription"
                className={styles.businessDescriptionTextarea}
                value={formData.businessDescription}
                onChange={handleChange}
              />
            ) : (
              ""
            )}
          </div>

          <div className={styles.addressAndContactContainer}>
            <div className={styles.contactContainer}>
              <div className={styles.contactInfo}>
                <h3>Contact</h3>
                {(supplierData?.contact?.phone && !isOwner) ||
                (isOwner && !editMode) ? (
                  <p>Phone: {supplierData?.contact?.phone} </p>
                ) : editMode ? (
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
                ) : (
                  ""
                )}
                {(supplierData?.contact?.email && !isOwner) ||
                (isOwner && !editMode) ? (
                  <p>Email: {supplierData?.contact?.email}</p>
                ) : editMode ? (
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
                ) : (
                  ""
                )}
                <div className={styles.socialMedia}>
                  <a href={supplierData?.contact?.socialMedia?.facebook}>
                    Facebook
                  </a>
                  <a href={supplierData?.contact?.socialMedia?.linkedin}>
                    LinkedIn
                  </a>
                  <a href={supplierData?.contact?.socialMedia?.instagram}>
                    Instagram
                  </a>
                </div>
              </div>
            </div>
            <div className={styles.addressContainer}>
              <h3>Address</h3>
              {(supplierData?.address && !isOwner) || (isOwner && !editMode) ? (
                <p>{supplierData?.address}</p>
              ) : editMode ? (
                <input
                  className={styles.addressInput}
                  name="address"
                  value={formData?.address}
                  onChange={handleChange}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className={styles.listingsContainer}>
          <h3>Listings</h3>
          <div className={styles.mainListingsContainer}>
            {listings.length > 0 ? (
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
          <p>No reviews yet</p>
        </div>
      </header>
    </div>
  );
};

export default SupplierHome;
