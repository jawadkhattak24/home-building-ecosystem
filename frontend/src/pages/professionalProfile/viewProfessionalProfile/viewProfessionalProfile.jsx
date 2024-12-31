import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaCloudUploadAlt,
  FaImages,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import PropTypes from "prop-types";
import { useLoading } from "../../../contexts/loadingContext";
import styles from "./styles/viewProfessionalProfile.module.scss";
import { useAuth } from "../../../contexts/authContext";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";

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
  const { currentUser } = useAuth();
  const { isLoading, setIsLoading, LoadingUI } = useLoading();

  const [selectedImage, setSelectedImage] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const initialPortfolio = [];

  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const itemsToShow = 3;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(
    async (formData) => {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${
            import.meta.env.VITE_API_URL
          }/api/user/professional-profile/update-portfolio/${userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            transformRequest: [(data) => data],
          }
        );

        if (response.data.portfolio) {
          setPortfolio(response.data.portfolio);
        }
      } catch (error) {
        console.error("Error uploading portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [userId, setIsLoading]
  );

  const handleFileUpload = useCallback(
    async (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        setIsUploading(true);
        const formData = new FormData();
        Array.from(files).forEach((file) => {
          formData.append("portfolio", file);
        });

        try {
          const response = await handleUpload(formData);
          if (response?.data?.portfolio) {
            setPortfolio(response.data.portfolio);
          }
        } catch (error) {
          console.error("Error uploading files:", error);
        } finally {
          setIsUploading(false);
        }
      }
    },
    [handleUpload]
  );

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
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("portfolio", file);
    });

    handleUpload(formData);
  }, []);

  const handleDelete = useCallback((e, index) => {
    e.stopPropagation();
    setPortfolio((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const totalItems = portfolio.length + (isOwner && isEditMode && portfolio.length < 5 ? 1 : 0);
      const nextIndex = prev + 1;
      return nextIndex >= totalItems - (itemsToShow - 1) ? prev : nextIndex;
    });
  }, [portfolio.length, isOwner, isEditMode]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      const prevIndex = prev - 1;
      return prevIndex < 0 ? 0 : prevIndex;
    });
  }, []);

  const handleImageClick = (index) => {
    openImageViewer(index);
  };

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

  const openImageViewer = (index) => {
    setSelectedImage(index);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
    setSelectedImage(null);
  };

  const handleNextImage = useCallback(() => {
    setSelectedImage((prev) => (prev < portfolio.length - 1 ? prev + 1 : prev));
  }, [portfolio.length]);

  const handlePrevImage = useCallback(() => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isViewerOpen) return;

      switch (e.key) {
        case "Escape":
          closeImageViewer();
          break;
        case "ArrowRight":
          handleNextImage();
          break;
        case "ArrowLeft":
          handlePrevImage();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isViewerOpen, handleNextImage, handlePrevImage]);

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

        if (professionalResponse.data.portfolio) {
          setPortfolio(professionalResponse.data.portfolio);
        }
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
    if (!isEditMode) return;
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

  const handleDeleteClick = (e, index) => {
    e.stopPropagation();
    setDeleteIndex(index);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/professional-profile/delete-portfolio/${userId}/${deleteIndex}`
      );
      
      if (response.data.portfolio) {
        setPortfolio(response.data.portfolio);
      }
      
      setShowDeleteDialog(false);
      setDeleteIndex(null);
    } catch (error) {
      console.error("Error deleting portfolio image:", error);
    }
  };

  if (!professionalData || !userData) {
    return <LoadingUI />;
  }

  const { serviceType, yearsExperience, bio, certifications, rating, reviews } =
    professionalData;

  const { name } = userData;

  return (
    <div
      className={`${styles.viewProfessionalProfile} ${
        isEditMode ? styles.editMode : ""
      }`}
    >
      <div
        className={styles.coverImage}
        style={{ backgroundImage: `url(${coverPicture})` }}
      >
        {isOwner && isEditMode && (
          <label htmlFor="coverImage" className={styles.editCoverImageIcon}>
            <FaPencilAlt />
            <input
              type="file"
              id="coverImage"
              hidden
              accept="image/*"
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
            {isOwner && isEditMode && (
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
            <div className={styles.nameAndEditButton}>
              {editMode.name ? (
                <div className={styles.editField}>
                  <input
                    type="text"
                    value={editedData.name}
                    className={styles.nameEditInput}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  <button onClick={() => handleSave("name")}>Save</button>
                  <button
                    onClick={() => setEditMode({ ...editMode, name: false })}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <h1>
                  {name}
                  {isOwner && isEditMode && (
                    <FaPencilAlt
                      className={styles.editIcon}
                      onClick={() => handleEditClick("name")}
                    />
                  )}
                </h1>
              )}
              {isOwner && (
                <button
                  className={`${styles.editProfileButton} ${
                    isEditMode ? styles.active : ""
                  }`}
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  {isEditMode ? "Done Editing" : "Edit Profile"}
                </button>
              )}
            </div>

            {editMode.serviceType ? (
              <div className={styles.editField}>
                <input
                  type="text"
                  value={editedData.serviceType}
                  className={styles.serviceTypeEditInput}
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
              </div>
            ) : (
              <h2>
                {serviceType}
                {isOwner && isEditMode && (
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
                  {isOwner && isEditMode && (
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
                  <div className={styles.experienceEditField}>
                    <input
                      type="number"
                      value={editedData.yearsExperience}
                      onChange={(e) =>
                        handleChange("yearsExperience", e.target.value)
                      }
                    />
                    <div className={styles.buttonGroup}>
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
                  </div>
                ) : (
                  <span>
                    {yearsExperience} Years of Experience
                    {isOwner && isEditMode && (
                      <FaPencilAlt
                        className={styles.experienceEditIcon}
                        onClick={() => handleEditClick("yearsExperience")}
                      />
                    )}
                  </span>
                )}
              </div>
              <div className={styles.experienceItem}>
                <FaCertificate />
                {editMode.certifications ? (
                  <div className={styles.experienceEditField}>
                    <input
                      type="text"
                      value={editedData.certifications}
                      onChange={(e) =>
                        handleChange("certifications", e.target.value)
                      }
                    />

                    <div className={styles.buttonGroup}>
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
                  </div>
                ) : (
                  <span>
                    {certifications}
                    {isOwner && isEditMode && (
                      <FaPencilAlt
                        className={styles.experienceEditIcon}
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
                        <p>Click to upload images</p>
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
                    <div className={styles.navIcon}>
                      <LucideChevronLeft size={20} />
                    </div>
                  </button>

                  <div
                    className={styles.portfolioGrid}
                    style={{
                      transform: `translateX(-${
                        currentIndex * (100 / itemsToShow)
                      }%)`,
                      transition: "transform 0.3s ease",
                    }}
                  >
                    {portfolio.map((image, index) => (
                      <div
                        key={index}
                        className={styles.portfolioItem}
                        onClick={() => handleImageClick(index)}
                      >
                        <img src={image} alt={`Portfolio ${index + 1}`} />
                        {isOwner && isEditMode && (
                          <button
                            className={styles.deleteButton}
                            onClick={(e) => handleDeleteClick(e, index)}
                          >
                            <div className={styles.deleteIcon}>
                              <FaTrash size={20} />
                            </div>
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {isOwner && isEditMode && portfolio.length < 5 && (
                      <div className={`${styles.portfolioItem} ${styles.uploadPlaceholder}`}>
                        <input
                          type="file"
                          id="portfolio-upload"
                          multiple
                          accept="image/*"
                          onChange={handleFileUpload}
                          className={styles.fileInput}
                          disabled={isUploading}
                        />
                        <label htmlFor="portfolio-upload" className={styles.uploadLabel}>
                          {isUploading ? (
                            <div className={styles.uploadingState}>
                              <div className={styles.spinner}></div>
                              <span>Uploading...</span>
                            </div>
                          ) : (
                            <>
                              <FaCloudUploadAlt className={styles.uploadIcon} />
                              <span>Add Photo</span>
                            </>
                          )}
                        </label>
                      </div>
                    )}
                  </div>

                  <button
                    className={`${styles.navButton} ${styles.nextButton}`}
                    onClick={handleNext}
                    disabled={currentIndex >= (portfolio.length + (isOwner && isEditMode && portfolio.length < 5 ? 1 : 0)) - itemsToShow}
                  >
                    <div className={styles.navIcon}>
                      <LucideChevronRight size={20} />
                    </div>
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

      {isViewerOpen && (
        <div className={styles.imageViewer} onClick={closeImageViewer}>
          <button className={styles.closeButton} onClick={closeImageViewer}>
            <FaTimes />
          </button>

          <div
            className={styles.imageContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={portfolio[selectedImage]}
              alt={`Portfolio ${selectedImage + 1}`}
            />

            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={handlePrevImage}
              disabled={selectedImage === 0}
            >
              <FaChevronLeft />
            </button>

            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={handleNextImage}
              disabled={selectedImage === portfolio.length - 1}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      {showDeleteDialog && (
        <div className={styles.dialogOverlay} onClick={() => setShowDeleteDialog(false)}>
          <div className={styles.dialogContent} onClick={e => e.stopPropagation()}>
            <h3>Delete Image</h3>
            <p>Are you sure you want to delete this image?</p>
            <div className={styles.dialogButtons}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.deleteButton}
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfessionalProfile;

ViewProfessionalProfile.propTypes = {
  userId: PropTypes.string.isRequired,
};
