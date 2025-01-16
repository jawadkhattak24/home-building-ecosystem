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
import { useLoading } from "../../../contexts/loadingContext";
import styles from "./styles/homeownerProfile.module.scss";
import { useAuth } from "../../../contexts/authContext";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";

import { FaStar, FaRegStar, FaPencilAlt } from "react-icons/fa";

const HomeownerProfile = () => {
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
      const totalItems =
        portfolio.length +
        (isOwner && isEditMode && portfolio.length < 5 ? 1 : 0);
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

  const coverPictureNew =
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  useEffect(() => {
    const fetchProfessionalData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const professionalResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "Professional Response in homeowner: ",
          professionalResponse.data
        );

        setProfessionalData(professionalResponse.data);

        // const userResponse = await axios.get(
        //   `${import.meta.env.VITE_API_URL}/api/user/user/${
        //     professionalResponse.data.userId
        //   }`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );
        setUserData(professionalResponse.data);
        setCoverPicture(professionalResponse.data.coverPictureUrl);
        setProfilePicture(professionalResponse.data.profilePictureUrl);

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
        style={{ backgroundImage: `url(${coverPictureNew})` }}
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

            <div className={styles.location}>
              <p>{"Location not set"}</p>
            </div>

            {/* {editMode.serviceType ? (
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
            )} */}

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

            {/* <div className={`${styles.infoCard} ${styles.editableSection}`}>
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
            </div> */}

            <div className={`${styles.infoCard} ${styles.editableSection}`}>
              <h3>Reviews Given</h3>
              <div className={styles.reviews}>
                <p>{"No reviews given"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeownerProfile;
