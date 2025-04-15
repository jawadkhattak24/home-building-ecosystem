import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./styles/viewProfessionalProfile.module.scss";
import LoadingSkeleton from "../viewProfessionalProfile/loadingSkeleton/loadingSkeleton.jsx";
import { useAuth } from "../../../contexts/authContext";
import { ChatContext } from "../../../contexts/chatContext";
import ReviewDialog from "../../../components/reviewDialog/reviewDialog";
import toast from "react-hot-toast";
import {
  FaBriefcase,
  FaCertificate,
  FaCheck,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaCloudUploadAlt,
  FaHeart,
  FaImages,
  FaMapMarkerAlt,
  FaPencilAlt,
  FaRegStar,
  FaStar,
  FaTimes,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";
import ReviewList from "../../../components/reviewList/reviewList";
import { Toaster } from "react-hot-toast";

const ViewProfessionalProfile = () => {
  const {
    activeConversation,
    setActiveConversation,
    checkConversationExists,
    handleUserSelect,
  } = useContext(ChatContext);
  const navigate = useNavigate();
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [professionalData, setProfessionalData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isOwner, setIsOwner] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

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
  const position = [33.7269, 73.0869];

  const [isExpanded, setIsExpanded] = useState(false);
  const bioRef = useRef(null);
  const [shouldShowViewMore, setShouldShowViewMore] = useState(false);

  const [mapPosition, setMapPosition] = useState(null);

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState(null);

  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //     axios.post(
  //         `${import.meta.env.VITE_API_URL}/api/user/professional/${
  //             professionalData?._id
  //         }/click`
  //     );
  //     // console.log("Clicked: ", professionalData?._id);
  // }, [professionalData?._id]);

  useEffect(() => {
    if (bioRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(bioRef.current).lineHeight
      );
      const height = bioRef.current.scrollHeight;
      const lines = height / lineHeight;
      setShouldShowViewMore(lines > 3);
    }
  }, [professionalData?.bio]);

  const fetchProfessionalData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      console.log("fetching professional data for: ", userId);

      const professionalResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/professional/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (professionalResponse.data.portfolio) {
        setPortfolio(professionalResponse.data.portfolio);
      }

      setIsOwner(professionalResponse.data.userId._id === currentUser.id);

      // console.log("Professional Response old: ", professionalResponse.data);

      setProfessionalData(professionalResponse.data);

      const userResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/user/${
          professionalResponse.data.userId._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(userResponse.data);
      setProfilePicture(userResponse.data.profilePictureUrl);

      // console.log("Professional Response new: ", professionalResponse.data);
      // console.log("User Response: ", userResponse.data);
    } catch (error) {
      console.error("Error fetching professional data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionalData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/professional/save/${
          professionalData.userId._id
        }`,
        { userId: currentUser.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setIsSaved(true);
        toast.success("Professional added to favorites!", {
          position: "bottom-right",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to add to favorites. Please try again.", {
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  const handleUnsaveProfile = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/professional/unsave/${
          professionalData?.userId._id
        }`,
        {
          data: { userId: currentUser.id },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setIsSaved(false);
        toast.success("Professional removed from favorites", {
          position: "bottom-right",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error unsaving profile:", error);
      toast.error("Failed to remove from favorites. Please try again.", {
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  const checkIfSaved = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log("Response: ", response.data);
      const saved = response.data.user.savedProfiles.includes(
        professionalData?.userId._id
      );
      setIsSaved(saved);
    } catch (error) {
      console.error("Error checking if profile is saved:", error);
    }
  }, [professionalData?.userId]);

  // console.log("Checking if profile is saved: ", checkIfSaved());

  useEffect(() => {
    checkIfSaved();
  }, [checkIfSaved]);

  const handleChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleContact = async () => {
    console.log("Contacting user: ", professionalData);
    let conversationId;

    const conversationExists = await checkConversationExists(
      professionalData?._id,
      currentUser.id
    );
    if (conversationExists) {
      // console.log("Conversation exists: ", conversationExists);
      conversationId = conversationExists;
      localStorage.setItem("activeConversation", conversationId);
      navigate("/inbox");
    } else {
      console.log("Creating a new conversation with: ", professionalData?._id);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/conversations`,
        {
          participant: professionalData?._id,
          userType: "professional",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Conversation Response: ", response.data);
      const data = response.data;
      await new Promise((resolve) => {
        console.log("Setting active conversation to:", data._id);
        setActiveConversation(data._id);
        resolve();
      });
      conversationId = data._id;
      localStorage.setItem("activeConversation", conversationId);

      navigate("/inbox");
    }
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
        break;
      case "serviceType":
        dataToSend = editedData.serviceType;
        break;
      case "yearsExperience":
        dataToSend = editedData.yearsExperience;
        break;
      case "bio":
        dataToSend = editedData.bio;
        break;
      case "certifications":
        dataToSend = editedData.certifications;
        break;
      case "qualifications":
        dataToSend = editedData.qualifications;
        break;
      case "address":
        dataToSend = editedData.address;
        break;
      case "ratePerHour":
        dataToSend = editedData.ratePerHour;
        break;
      default:
        dataToSend = "";
    }

    console.log("Data to send: ", dataToSend);

    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/user/professional-profile/update/${field}/${userId}`,
        { dataToSend }
      );
      if (response.status == 201) {
        await fetchProfessionalData();
        toast.success(
          `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } updated successfully!`,
          {
            position: "bottom-right",
            duration: 3000,
          }
        );
      }
    } catch (err) {
      console.error("An error occurred while updating profile:", err);
      toast.error(`Failed to update ${field}. Please try again.`, {
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
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

  // console.log("userData", userData);
  // console.log("professionalData", professionalData);
  // console.log("professionalData?.ratePerHour", professionalData?.ratePerHour);
  const specialization = ["Architect", "Interior Designer", "Contractor"];

  const formattedDate = new Date(userData?.createdAt).toLocaleDateString(
    "en-US",
    { month: "short", year: "numeric" }
  );

  const geocodeAddress = async (address) => {
    setIsGeocoding(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return [parseFloat(lat), parseFloat(lon)];
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      setGeocodingError(error.message);
      return null;
    } finally {
      setIsGeocoding(false);
    }
  };

  useEffect(() => {
    const updateMapPosition = async () => {
      if (professionalData?.address) {
        const coordinates = await geocodeAddress(professionalData.address);
        if (coordinates) {
          setMapPosition(coordinates);
        }
      }
    };

    updateMapPosition();
  }, [professionalData?.address]);

  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reviews/professional/${
          professionalData?._id
        }`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (professionalData?._id) {
      fetchReviews();
    }
  }, [professionalData?._id]);

  console.log("Professional Data: ", professionalData);

  const handleReviewSubmit = async (formData) => {
    try {
      const professionalId = professionalData?._id;

      if (!professionalId) {
        toast.error("Cannot submit review: Professional ID is missing", {
          position: "bottom-right",
          duration: 3000,
        });
        return;
      }

      const submitData = new FormData();
      submitData.append("rating", formData.get("rating"));
      submitData.append("description", formData.get("description"));
      if (formData.get("image")) {
        submitData.append("image", formData.get("image"));
      }

      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/reviews/professional/${professionalId}`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Review submitted successfully!", {
          position: "bottom-right",
          duration: 3000,
        });

        // Fetch updated data before closing dialog
        await Promise.all([fetchProfessionalData(), fetchReviews()]);

        // Only close dialog after data is refreshed
        setShowReviewDialog(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);

      if (error.response) {
        toast.error(
          `Failed to submit review: ${
            error.response.data.error || "Unknown error occurred"
          }`,
          {
            position: "bottom-right",
            duration: 3000,
          }
        );
      } else {
        toast.error("Failed to submit review. Please try again later.", {
          position: "bottom-right",
          duration: 3000,
        });
      }
      // Return false to indicate submission failed
      return false;
    }
    // Return true to indicate submission succeeded
    return true;
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className={styles.viewProfessionalProfile}>
      <div className={styles.basicInfoContainer}>
        <div className={styles.userCard}>
          <div className={styles.nameAndPictureContainer}>
            <div className={styles.imageContainer}>
              <img
                className={styles.profilePicture}
                src={professionalData?.userId?.profilePictureUrl}
                alt="profile photo"
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
                  {professionalData?.userId?.name}

                  <FaCheckCircle className={styles.verifiedIcon} />

                  {isOwner && isEditMode && (
                    <FaPencilAlt
                      className={styles.editIcon}
                      onClick={() => handleEditClick("name")}
                    />
                  )}
                </h1>
              )}

              <p className={styles.city}>
                {userData?.city == "Unknown" ? "" : userData?.city}
              </p>
              <p className={styles.city}>
                Joined {""}
                {formattedDate}
              </p>
            </div>
          </div>

          <div className={styles.rating}>
            {[...Array(5)].map((_, index) =>
              index < Math.floor(professionalData?.rating) ? (
                <FaStar key={index} className={styles.starFilled} />
              ) : (
                <FaRegStar key={index} className={styles.starEmpty} />
              )
            )}
            <span className={styles.ratingText}>
              {parseFloat(professionalData?.rating).toFixed(1)}
            </span>{" "}
            <br />
            <span>({reviews?.length || 0} Reviews)</span>
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
            <button onClick={handleContact} className={styles.contactButton}>
              Contact
            </button>
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
                  {professionalData?.serviceType || "Choose a service type"}
                  {isOwner && isEditMode && (
                    <FaPencilAlt
                      className={styles.editIcon}
                      onClick={() => handleEditClick("serviceType")}
                    />
                  )}
                </h1>
              )}
            </div>

            <div className={styles.buttonsContainer}>
              {/* <button
                type="button"
                className={styles.heartButton}
                shape="default"
                data-active="false"
                data-loading="false"
                aria-disabled="false"
                display="inline-flex"
                data-component="Save"
                data-entity-type="10"
                data-entity-id="2522085"
              >
                <svg
                  viewBox="0 0 16 16"
                  width="1em"
                  color="currentColor"
                  display="inline-block"
                  focusable="false"
                  role="img"
                  aria-hidden="true"
                  className={styles.saveIcon}
                >
                  <path
                    d="M8 3.625L9.495 6.915L12.675 7.204L10.393 9.485L10.986 13.043L8 11.251L5.014 13.043L5.607 9.485L3.325 7.2L6.505 6.911L8 3.625ZM8 0L5.5 5.5L0 6L4 10L3 16L8 13L13 16L12 10L16 6L10.5 5.5L8 0Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span>Write a Review</span>
              </button>

              {!isOwner && (
                <button
                  type="button"
                  className={styles.heartButton}
                  shape="default"
                  data-active="false"
                  data-loading="false"
                  aria-disabled="false"
                  display="inline-flex"
                  data-component="Save"
                  data-entity-type="10"
                  data-entity-id="2522085"
                >
                  <svg
                    color="currentColor"
                    display="inline-block"
                    focusable="false"
                    role="img"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className={styles.saveIcon}
                  >
                    <path
                      fill="currentColor"
                      d="M15 3.75h.01c1.372 0 2.484 1.112 2.484 2.484 0 .616-.225 1.18-.596 1.615l.003-.003-6.9 7.28-6.905-7.28a2.4804 2.4804 0 01-.587-1.607c0-1.376 1.115-2.491 2.491-2.491.691 0 1.317.282 1.769.737l3.232 3.229 3.233-3.229c.451-.453 1.075-.734 1.765-.734h.003zm0-2.5c-1.38.001-2.629.56-3.534 1.465L10 4.179 8.534 2.715C7.63 1.809 6.381 1.248 5 1.248 2.243 1.248.009 3.483.009 6.239c0 1.26.467 2.41 1.236 3.289l-.005-.006L10 18.75l8.76-9.227c.77-.873 1.239-2.026 1.239-3.289 0-2.752-2.231-4.984-4.984-4.984h-.016H15z"
                    ></path>
                  </svg>
                  Save
                </button> */}

              {!isOwner && (
                <div
                  className={styles.heartButton}
                  onClick={() => setShowReviewDialog(true)}
                >
                  <FaStar className={styles.saveIcon} />
                  <span>Review</span>
                </div>
              )}
              {!isOwner && (
                <div
                  className={styles.heartButton}
                  onClick={isSaved ? handleUnsaveProfile : handleSaveProfile}
                >
                  <FaHeart
                    className={`${styles.saveIcon} ${
                      isSaved ? styles.saved : ""
                    }`}
                  />
                  {isSaved ? <span>Saved</span> : <span>Save</span>}
                </div>
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
                  {professionalData?.certifications || "No certifications yet"}
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

            {professionalData?.address &&
              (mapPosition ? (
                <MapContainer
                  className={styles.mapContainer}
                  center={mapPosition}
                  zoom={14}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={mapPosition}>
                    <Popup>{professionalData.address}</Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <div className={styles.mapError}></div>
              ))}
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
            {editMode.yearsExperience ? (
              <div className={styles.editField}>
                <input
                  type="number"
                  value={editedData.yearsExperience}
                  className={styles.experienceEditInput}
                  onChange={(e) =>
                    handleChange("yearsExperience", e.target.value)
                  }
                />

                <div
                  onClick={() => handleSave("yearsExperience")}
                  className={styles.saveButton}
                >
                  <FaCheck />
                </div>
                <div
                  onClick={() =>
                    setEditMode({ ...editMode, yearsExperience: false })
                  }
                  className={styles.cancelButton}
                >
                  <FaTimes />
                </div>
              </div>
            ) : (
              <h2 className={styles.experienceDescription}>
                {professionalData?.yearsExperience + " years"}
                {/* {Math.floor(Math.random() * 10)} years */}
                {isOwner && isEditMode && (
                  <FaPencilAlt
                    className={styles.editIcon}
                    onClick={() => handleEditClick("yearsExperience")}
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
                  className={`${styles.bioDescription} ${
                    !isExpanded ? styles.collapsed : ""
                  }`}
                >
                  {professionalData?.bio || "No bio yet"}
                </p>
                {shouldShowViewMore && (
                  <button
                    className={styles.viewMoreButton}
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? "View Less" : "View More"}
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
      <div className={styles.mainPortfolioContainer}>
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
      </div>
      <div className={styles.reviewsContainer}>
        <h2>Reviews ({reviews.length})</h2>
        {isLoadingReviews ? (
          <div className={styles.loadingReviews}>Loading reviews...</div>
        ) : (
          <ReviewList reviews={reviews} />
        )}
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

      {showReviewDialog && (
        <ReviewDialog
          isOpen={showReviewDialog}
          onClose={() => setShowReviewDialog(false)}
          onSubmit={handleReviewSubmit}
          professionalId={professionalData?._id}
        />
      )}
      <Toaster position="bottom-right" />
    </div>
  );
};

export default ViewProfessionalProfile;
