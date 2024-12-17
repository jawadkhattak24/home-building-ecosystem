import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "redaxios";
import {
  FaCloudUploadAlt,
  FaImages,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
} from "react-icons/fa";
import PropTypes from "prop-types";
import { useLoading } from "../../../contexts/loadingContext";
import styles from "./styles/viewProfessionalProfile.module.scss";
import { useAuth } from "../../../contexts/authContext";

import {
  FaStar,
  FaRegStar,
  FaMapMarkerAlt,
  FaCertificate,
  FaBriefcase,
  FaPencilAlt,
} from "react-icons/fa";

const ViewProfessionalProfile = () => {
  const { userId } = useParams();
  const [professionalData, setProfessionalData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);

  const initialPortfolio = [];

  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const itemsToShow = 3;

  const handleFileUpload = useCallback((event) => {
    const files = event.target.files;
    handleFiles(Array.from(files));
  }, []);

  const handleFiles = async (files) => {
    const validFiles = files.filter((file) => {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024;
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      alert(
        "Some files were skipped. Please ensure all files are images under 5MB."
      );
    }

    const newImages = await Promise.all(
      validFiles.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          })
      )
    );

    setPortfolio((prev) => [...prev, ...newImages]);
  };

  const handleSave = async (field) => {
    setIsLoading(true);

    let dataToSend = "";

    switch (field) {
      case "name":
        dataToSend = editedData.name;
        console.log(field);
        break;
      case "serviceType":
        dataToSend = editedData.serviceType;
        console.log(field);
        break;
      case "bio":
        dataToSend = editedData.bio;
        console.log(field);
        break;
      case "certifications":
        dataToSend = editedData.certifications;
        console.log(field);
        break;
      default:
        dataToSend = "";
    }

    try {
      console.log("Field being updated: ", dataToSend);
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/user/professional-profile/update/${field}/${userId}`,
        { dataToSend }
      );
      if (response.status == 201) {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("An error occured while updating profile:", err);
    } finally {
      setEditMode({
        name: "",
        serviceType: "",
        bio: "",
        yearsExperience: "",
        certifications: "",
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleDelete = useCallback((e, index) => {
    e.stopPropagation();
    setPortfolio((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, portfolio.length - itemsToShow)
    );
  }, [portfolio.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleImageClick = useCallback((index) => {
    console.log("Opening lightbox for image:", index);
  }, []);

  const [editMode, setEditMode] = useState({
    name: false,
    serviceType: false,
    bio: false,
    yearsExperience: false,
    certifications: false,
  });

  const [editedData, setEditedData] = useState({
    name: "",
    serviceType: "",
    bio: "",
    yearsExperience: "",
    certifications: "",
  });

  const { currentUser } = useAuth();
  const { isLoading, setIsLoading, LoadingUI } = useLoading();

  useEffect(() => {
    if (profilePicture || coverPicture) {
      setUserData((prev) => ({
        ...prev,
        profilePictureUrl: profilePicture || prev.profilePictureUrl,
        coverPictureUrl: coverPicture || prev.coverPictureUrl,
      }));
    }
  }, [profilePicture, coverPicture]);

  useEffect(() => {
    const fetchProfessionalData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const professionalResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/professional/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfessionalData(professionalResponse.data);

        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/user/${
            professionalResponse.data.userId
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(userResponse.data);
        setCoverPicture(userResponse.data.coverPictureUrl);
        setProfilePicture(userResponse.data.profilePictureUrl);

        setIsOwner(professionalResponse.data.userId === currentUser.id);
      } catch (error) {
        console.error("Error fetching professional data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionalData();
  }, [
    userId,
    setIsLoading,
    currentUser,
    profilePicture,
    coverPicture,
    editMode,
  ]);

  const handleEditClick = (field) => {
    setEditMode({ ...editMode, [field]: true });
    setEditedData({
      ...editedData,
      [field]: field === "name" ? userData[field] : professionalData[field],
    });
  };

  const handleChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/${
          currentUser.id
        }/profile-picture`,
        formData
      );
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/${
          currentUser.id
        }/profile-picture`
      );
      setProfilePicture(response.data.profilePictureUrl);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleCoverPictureUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("coverPicture", file);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/${
          currentUser.id
        }/cover-picture`,
        formData
      );
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/${
          currentUser.id
        }/cover-picture`
      );
      setCoverPicture(response.data.coverPictureUrl);
    } catch (error) {
      console.error("Error uploading cover picture:", error);
    }
  };

  if (!professionalData || !userData) {
    return <LoadingUI />;
  }

  const {
    serviceType,
    yearsExperience,
    bio,
    certifications,

    rating,
    reviews,
  } = professionalData;

  const { name } = userData;

  return (
    <div className={styles.viewProfessionalProfile}>
      <div
        className={styles.coverImage}
        style={{ backgroundImage: `url(${coverPicture})` }}
      >
        {isOwner && (
          <label htmlFor="coverImage" className={styles.editCoverImageIcon}>
            <FaPencilAlt />
            <input
              type="file"
              id="coverImage"
              hidden
              accept="image/*"
              className={styles.coverPicInput}
              onChange={handleCoverPictureUpload}
            />
          </label>
        )}
      </div>

      <div className={styles.profileContent}>
        <div className={styles.profileHeader}>
          <div className={styles.imageContainer}>
            <img
              src={profilePicture}
              alt={name}
              className={styles.profilePicture}
            />
            {isOwner && (
              <label
                htmlFor="profileImage"
                className={styles.editProfileImageIcon}
              >
                <FaPencilAlt />
                <input
                  type="file"
                  id="profileImage"
                  hidden
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                />
              </label>
            )}
          </div>
          <div className={styles.headerInfo}>
            {editMode.name ? (
              <h1 className={styles.editField}>
                <input
                  type="text"
                  value={editedData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                <button onClick={() => handleSave("name")}>Save</button>
                <button
                  onClick={() => setEditMode({ ...editMode, name: false })}
                >
                  Cancel
                </button>
              </h1>
            ) : (
              <h1>
                {name}
                {isOwner && (
                  <FaPencilAlt
                    className={styles.editIcon}
                    onClick={() => handleEditClick("name")}
                  />
                )}
              </h1>
            )}

            {editMode.serviceType ? (
              <h2 className={styles.editField}>
                <input
                  type="text"
                  value={editedData.serviceType}
                  onChange={(e) => handleChange("serviceType", e.target.value)}
                />
                <button onClick={() => handleSave("serviceType")}>Save</button>
                <button
                  onClick={() =>
                    setEditMode({ ...editMode, serviceType: false })
                  }
                >
                  Cancel
                </button>
              </h2>
            ) : (
              <h2>
                {serviceType}
                {isOwner && (
                  <FaPencilAlt
                    className={styles.editIcon}
                    onClick={() => handleEditClick("serviceType")}
                  />
                )}
              </h2>
            )}

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
            <div className={`${styles.infoCard} ${styles.editableSection}`}>
              <h3>About</h3>
              {editMode.bio ? (
                <div className={styles.editField}>
                  <textarea
                    value={editedData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Write something about yourself..."
                  />
                  <div className={styles.buttonGroup}>
                    <button onClick={() => handleSave("bio")}>Save</button>
                    <button
                      onClick={() => setEditMode({ ...editMode, bio: false })}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p>{bio}</p>
                  {isOwner && (
                    <FaPencilAlt
                      className={styles.editIcon}
                      onClick={() => handleEditClick("bio")}
                    />
                  )}
                </>
              )}
            </div>

            <div className={`${styles.infoCard} ${styles.editableSection}`}>
              <h3>Experience & Certifications</h3>
              <div className={styles.experienceItem}>
                <FaBriefcase />
                {editMode.yearsExperience ? (
                  <div className={styles.editField}>
                    <input
                      type="number"
                      value={editedData.yearsExperience}
                      onChange={(e) =>
                        handleChange("yearsExperience", e.target.value)
                      }
                    />
                    <button onClick={() => handleSave("yearsExperience")}>
                      Save
                    </button>
                    <button
                      onClick={() =>
                        setEditMode({ ...editMode, yearsExperience: false })
                      }
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span>
                    {yearsExperience} Years of Experience
                    {isOwner && (
                      <FaPencilAlt
                        className={styles.editIcon}
                        onClick={() => handleEditClick("yearsExperience")}
                      />
                    )}
                  </span>
                )}
              </div>
              <div className={styles.experienceItem}>
                <FaCertificate />
                {editMode.certifications ? (
                  <div className={styles.editField}>
                    <input
                      type="text"
                      value={editedData.certifications}
                      onChange={(e) =>
                        handleChange("certifications", e.target.value)
                      }
                    />
                    <button onClick={() => handleSave("certifications")}>
                      Save
                    </button>
                    <button
                      onClick={() =>
                        setEditMode({ ...editMode, certifications: false })
                      }
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span>
                    {certifications}
                    {isOwner && (
                      <FaPencilAlt
                        className={styles.editIcon}
                        onClick={() => handleEditClick("certifications")}
                      />
                    )}
                  </span>
                )}
              </div>
            </div>

            <div className={`${styles.infoCard} ${styles.editableSection}`}>
              <h3>Portfolio</h3>

              {portfolio.length === 0 ? (
                <div className={styles.emptyState}>
                  {isOwner ? (
                    <div className={styles.uploadZone}>
                      <input
                        type="file"
                        id="portfolio-upload"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className={styles.fileInput}
                      />
                      <label
                        htmlFor="portfolio-upload"
                        className={styles.uploadLabel}
                      >
                        <FaCloudUploadAlt className={styles.uploadIcon} />
                        <p>Drag and drop images here or click to upload</p>
                        <span>Supported formats: JPG, PNG, WEBP (Max 5MB)</span>
                      </label>
                    </div>
                  ) : (
                    <div className={styles.noContent}>
                      <FaImages className={styles.emptyIcon} />
                      <p>No portfolio items yet</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.portfolioContainer}>
                  <button
                    className={`${styles.navButton} ${styles.prevButton}`}
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                  >
                    <FaChevronLeft />
                  </button>

                  <div className={styles.portfolioGrid}>
                    {portfolio.map((image, index) => (
                      <div
                        key={index}
                        className={styles.portfolioItem}
                        onClick={() => handleImageClick(index)}
                      >
                        <img src={image} alt={`Portfolio ${index + 1}`} />
                        {isOwner && (
                          <button
                            className={styles.deleteButton}
                            onClick={(e) => handleDelete(e, index)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    className={`${styles.navButton} ${styles.nextButton}`}
                    onClick={handleNext}
                    disabled={currentIndex >= portfolio.length - itemsToShow}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.rightSection}>
            <button className={styles.contactButton}>
              Contact Professional
            </button>

            <div className={styles.reviewsSection}>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfessionalProfile;

ViewProfessionalProfile.propTypes = {
  userId: PropTypes.string.isRequired,
};
