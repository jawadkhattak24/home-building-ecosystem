import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./styles/viewProfessionalProfile.module.scss";
import { useLoading } from "../../../contexts/loadingContext";
import { useAuth } from "../../../contexts/authContext";
import {
  FaStar,
  FaRegStar,
  FaMapMarkerAlt,
  FaChevronRight,
  FaChevronLeft,
  FaTimes,
  FaSave,
  FaCheck,
  FaCloudUploadAlt,
  FaImages,
  FaTrash,
  FaPencilAlt,
  FaCertificate,
  FaBriefcase,
  FaUser,
} from "react-icons/fa";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";

const ViewProfessionalProfile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const { isLoading, setIsLoading, LoadingUI } = useLoading();
  const [professionalData, setProfessionalData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isOwner, setIsOwner] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);
  const [portfolio, setPortfolio] = useState([]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [isUploading, setIsUploading] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const [editedData, setEditedData] = useState({
    name: "",
    serviceType: "",
    bio: "",
    yearsExperience: "",
    certifications: "",
    qualifications: "",
    ratePerHour: "",
    address: "",
  });

  const itemsToShow = 3;
  const position = [24.8607, 67.0104];

  const [isExpanded, setIsExpanded] = useState(false);
  const bioRef = useRef(null);
  const [shouldShowViewMore, setShouldShowViewMore] = useState(false);

  useEffect(() => {
    if (bioRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(bioRef.current).lineHeight);
      const height = bioRef.current.scrollHeight;
      const lines = height / lineHeight;
      setShouldShowViewMore(lines > 3);
    }
  }, [professionalData?.bio]);

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

  const handleEditClick = (field) => {
    if (!isEditMode) return;
    setEditMode({ ...editMode, [field]: true });
    setEditedData({
      ...editedData,
      [field]: field === "name" ? userData[field] : professionalData[field],
    });
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
      case "qualifications":
        dataToSend = editedData.qualifications;
        console.log(field);
        break;
      case "address":
        dataToSend = editedData.address;
        console.log(field);
        break;
      case "ratePerHour":
        dataToSend = editedData.ratePerHour;
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
        qualifications: "",
        address: "",
        ratePerHour: "",
      });
    }
  };

  const handleNextImage = useCallback(() => {
    setSelectedImage((prev) => (prev < portfolio.length - 1 ? prev + 1 : prev));
  }, [portfolio?.length]);

  const handlePrevImage = useCallback(() => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleDeleteClick = (e, index) => {
    e.stopPropagation();
    setDeleteIndex(index);
    setShowDeleteDialog(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
    setSelectedImage(null);
  };

  const openImageViewer = (index) => {
    setSelectedImage(index);
    setIsViewerOpen(true);
  };

  const handleImageClick = (index) => {
    openImageViewer(index);
  };

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

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const totalItems =
        portfolio.length +
        (isOwner && isEditMode && portfolio.length < 5 ? 1 : 0);
      const nextIndex = prev + 1;
      return nextIndex >= totalItems - (itemsToShow - 1) ? prev : nextIndex;
    });
  }, [portfolio.length, isOwner, isEditMode]);

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

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      const prevIndex = prev - 1;
      return prevIndex < 0 ? 0 : prevIndex;
    });
  }, []);

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/user/professional-profile/delete-portfolio/${userId}/${deleteIndex}`
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

  console.log("userData", userData);
  console.log("professionalData", professionalData);
  console.log("professionalData?.ratePerHour", professionalData?.ratePerHour);
  const specialization = ["Architect", "Interior Designer", "Contractor"];

  const formattedDate = new Date(userData?.createdAt).toLocaleDateString(
    "en-US",
    { month: "short", year: "numeric" }
  );

  return (
    <div className={styles.viewProfessionalProfile}>
      <div className={styles.basicInfoContainer}>
        <div className={styles.userCard}>
          <div className={styles.nameAndPictureContainer}>
            <div className={styles.imageContainer}>
              <img
                className={styles.profilePicture}
                src={userData?.profilePictureUrl}
                alt="profile"
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
            <div className={styles.nameContainer}>
              {editMode.name ? (
                <div className={styles.editField}>
                  <input
                    type="text"
                    value={editedData.name}
                    className={styles.nameEditInput}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  <div
                    className={styles.saveButton}
                    onClick={() => handleSave("name")}
                  >
                    <FaCheck />
                  </div>
                  <div
                    className={styles.cancelButton}
                    onClick={() => setEditMode({ ...editMode, name: false })}
                  >
                    <FaTimes />
                  </div>
                </div>
              ) : (
                <h1 className={styles.name}>
                  {userData?.name}
                  {isOwner && isEditMode && (
                    <FaPencilAlt
                      className={styles.editIcon}
                      onClick={() => handleEditClick("name")}
                    />
                  )}
                </h1>
              )}

              <p className={styles.city}>
                {userData?.city || "Karachi, Pakistan"}
              </p>
              <p className={styles.city}>
                Joined {""}
                {formattedDate}
              </p>
            </div>
          </div>

          <div className={styles.rating}>
            {[...Array(5)].map((_, index) =>
              index < Math.floor(userData?.rating) ? (
                <FaStar key={index} className={styles.starFilled} />
              ) : (
                <FaRegStar key={index} className={styles.starEmpty} />
              )
            )}
            <span>{userData?.rating}</span> <br />
            <span>({userData?.projectsCompleted || 13} projects)</span>
          </div>
          <div className={styles.rateContainer}>
            <p className={styles.rateText}>Starting at</p>
            <p className={styles.rateAmount}>
              {editMode.ratePerHour ? (
                <div className={styles.editField}>
                  <input
                    type="number"
                    value={editedData.ratePerHour}
                    className={styles.ratePerHourInput}
                    onChange={(e) =>
                      handleChange("ratePerHour", e.target.value)
                    }
                  />

                  <div
                    className={styles.saveButton}
                    onClick={() => handleSave("ratePerHour")}
                  >
                    <FaCheck />
                  </div>
                  <div
                    className={styles.cancelButton}
                    onClick={() =>
                      setEditMode({ ...editMode, ratePerHour: false })
                    }
                  >
                    <FaTimes />
                  </div>
                </div>
              ) : (
                <h1 className={styles.ratePerHour}>
                  ${professionalData?.ratePerHour} / hour
                  {isOwner && isEditMode && (
                    <FaPencilAlt
                      className={styles.editIcon}
                      onClick={() => handleEditClick("ratePerHour")}
                    />
                  )}
                </h1>
              )}
            </p>
          </div>
          {isOwner ? (
            <button
              className={`${styles.contactButton} ${
                isEditMode ? styles.active : ""
              }`}
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? "Done Editing" : "Edit Profile"}
            </button>
          ) : (
            <button className={styles.contactButton}>Contact</button>
          )}
        </div>
        <div className={styles.userInfo}>
          <div className={styles.serviceTypeContainer}>
            <div className={styles.serviceTypeWrapper}>
              {editMode.serviceType ? (
                <div className={styles.editField}>
                  <input
                    type="text"
                    value={editedData.serviceType}
                    className={styles.serviceTypeEditInput}
                    onChange={(e) =>
                      handleChange("serviceType", e.target.value)
                    }
                  />
                  <div
                    className={styles.saveButton}
                    onClick={() => handleSave("serviceType")}
                  >
                    <FaCheck />
                  </div>
                  <div
                    className={styles.cancelButton}
                    onClick={() =>
                      setEditMode({ ...editMode, serviceType: false })
                    }
                  >
                    <FaTimes />
                  </div>
                </div>
              ) : (
                <h1 className={styles.serviceType}>
                  {professionalData?.serviceType}
                  {isOwner && isEditMode && (
                    <FaPencilAlt
                      className={styles.editIcon}
                      onClick={() => handleEditClick("serviceType")}
                    />
                  )}
                </h1>
              )}
            </div>
            <div className={styles.certificationsWrapper}>
              {editMode.certifications ? (
                <div className={styles.editField}>
                  <input
                    type="text"
                    value={editedData.certifications}
                    onChange={(e) =>
                      handleChange("certifications", e.target.value)
                    }
                    className={styles.certificationsEditInput}
                  />

                  <div
                    className={styles.saveButton}
                    onClick={() => handleSave("certifications")}
                  >
                    <FaCheck />
                  </div>
                  <div
                    className={styles.cancelButton}
                    onClick={() =>
                      setEditMode({ ...editMode, certifications: false })
                    }
                  >
                    <FaTimes />
                  </div>
                </div>
              ) : (
                <h1 className={styles.certifications}>
                  {professionalData?.certifications}
                  {isOwner && isEditMode && (
                    <FaPencilAlt
                      className={styles.editIcon}
                      onClick={() => handleEditClick("certifications")}
                    />
                  )}
                </h1>
              )}
            </div>
          </div>

          <div className={styles.addressContainer}>
            <div className={styles.addressText}>
              <FaMapMarkerAlt />
              <p className={styles.address}>
                {editMode.address ? (
                  <div className={styles.editField}>
                    <textarea
                      value={editedData.address}
                      className={styles.addressEditInput}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                    <div
                      className={styles.saveButton}
                      onClick={() => handleSave("address")}
                    >
                      <FaCheck />
                    </div>
                    <div
                      className={styles.cancelButton}
                      onClick={() =>
                        setEditMode({ ...editMode, address: false })
                      }
                    >
                      <FaTimes />
                    </div>
                  </div>
                ) : (
                  <h1 className={styles.address}>
                    {professionalData?.address}
                    {isOwner && isEditMode && (
                      <FaPencilAlt
                        className={styles.editIcon}
                        onClick={() => handleEditClick("address")}
                      />
                    )}
                  </h1>
                )}
              </p>
            </div>
            <MapContainer
              className={styles.mapContainer}
              center={position}
              zoom={14}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={position}>
                <Popup>5245 Olde Wadsworth Boulevard Arvada, CO 80102</Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* <div className={styles.specializationContainer}>
            <h2 className={styles.specialization}>Specialization</h2>
            <div className={styles.specializationTags}>
              {specialization.map((item, index) => (
                <span key={index} className={styles.specializationTag}>
                  {item}
                </span>
              ))}
            </div>
          </div> */}

          <div className={styles.qualificationsContainer}>
            <h2 className={styles.qualifications}>
              <FaCertificate /> Qualifications
            </h2>
            {editMode.qualifications ? (
              <div className={styles.editField}>
                <input
                  type="text"
                  value={editedData.qualifications}
                  className={styles.qualificationsEditInput}
                  onChange={(e) =>
                    handleChange("qualifications", e.target.value)
                  }
                />

                <div
                  onClick={() => handleSave("qualifications")}
                  className={styles.saveButton}
                >
                  <FaCheck />
                </div>
                <div
                  onClick={() =>
                    setEditMode({ ...editMode, qualifications: false })
                  }
                  className={styles.cancelButton}
                >
                  <FaTimes />
                </div>
              </div>
            ) : (
              <h2 className={styles.qualificationsDescription}>
                {professionalData?.qualifications || "No qualifications yet"}

                {isOwner && isEditMode && (
                  <FaPencilAlt
                    className={styles.editIcon}
                    onClick={() => handleEditClick("qualifications")}
                  />
                )}
              </h2>
            )}
          </div>

          <div className={styles.experienceContainer}>
            <h2 className={styles.experience}>
              <FaBriefcase /> Experience
            </h2>
            {editMode.experience ? (
              <div className={styles.editField}>
                <input
                  type="number"
                  value={editedData.experience}
                  className={styles.experienceEditInput}
                  onChange={(e) => handleChange("experience", e.target.value)}
                />

                <div
                  onClick={() => handleSave("experience")}
                  className={styles.saveButton}
                >
                  <FaCheck />
                </div>
                <div
                  onClick={() =>
                    setEditMode({ ...editMode, experience: false })
                  }
                  className={styles.cancelButton}
                >
                  <FaTimes />
                </div>
              </div>
            ) : (
              <h2 className={styles.experienceDescription}>
                {professionalData?.yearsExperience || "No experience yet"}

                {isOwner && isEditMode && (
                  <FaPencilAlt
                    className={styles.editIcon}
                    onClick={() => handleEditClick("experience")}
                  />
                )}
              </h2>
            )}
          </div>

          <div className={styles.bioContainer}>
            <h2 className={styles.bio}>
              <FaUser /> Bio
            </h2>
            {editMode.bio ? (
              <div className={styles.editField}>
                <textarea
                  value={editedData.bio}
                  className={styles.bioEditInput}
                  onChange={(e) => handleChange("bio", e.target.value)}
                />

                <div
                  onClick={() => handleSave("bio")}
                  className={styles.saveButton}
                >
                  <FaCheck />
                </div>
                <div
                  onClick={() => setEditMode({ ...editMode, bio: false })}
                  className={styles.cancelButton}
                >
                  <FaTimes />
                </div>
              </div>
            ) : (
              <div className={styles.bioWrapper}>
                <p 
                  ref={bioRef}
                  className={`${styles.bioDescription} ${!isExpanded ? styles.collapsed : ''}`}
                >
                  {professionalData?.bio || "No bio yet"}
                </p>
                {shouldShowViewMore && (
                  <button 
                    className={styles.viewMoreButton}
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? 'View Less' : 'View More'}
                  </button>
                )}
                {isOwner && isEditMode && (
                  <FaPencilAlt
                    className={styles.editIcon}
                    onClick={() => handleEditClick("bio")}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.portfolioContainer}>
        <h2>Portfolio</h2>

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
                <div
                  className={`${styles.portfolioItem} ${styles.uploadPlaceholder}`}
                >
                  <input
                    type="file"
                    id="portfolio-upload"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className={styles.fileInput}
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="portfolio-upload"
                    className={styles.uploadLabel}
                  >
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
              disabled={
                currentIndex >=
                portfolio.length +
                  (isOwner && isEditMode && portfolio.length < 5 ? 1 : 0) -
                  itemsToShow
              }
            >
              <div className={styles.navIcon}>
                <LucideChevronRight size={20} />
              </div>
            </button>
          </div>
        )}
      </div>
      <div className={styles.reviewsContainer}>
        <h2>Reviews</h2>
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
        <div
          className={styles.dialogOverlay}
          onClick={() => setShowDeleteDialog(false)}
        >
          <div
            className={styles.dialogContent}
            onClick={(e) => e.stopPropagation()}
          >
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
