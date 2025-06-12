import { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./styles/listingDetailsPage.module.scss";
// import StarRatings from "../../components/starRating/starRating";
import {
  FaHeart,
  FaCommentDots,
  FaStar,
  FaStarHalf,
  FaPen,
} from "react-icons/fa";
import { ChatContext } from "../../contexts/chatContext";
import { useAuth } from "../../contexts/authContext";
import ListingDetailsPageLoadingSkeleton from "./loadingSkeleton/listingDetailsPageLoadingSkeleton";
import ListingReviewDialog from "../../components/listingReviewDialog/listingReviewDialog";
import PropTypes from "prop-types";

const StarRatings = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={styles.starRatings}>
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <FaStar key={i} className={styles.star} />;
        } else if (i === fullStars && hasHalfStar) {
          return <FaStarHalf key={i} className={styles.star} />;
        } else {
          return <FaStar key={i} className={styles.starEmpty} />;
        }
      })}
    </div>
  );
};

StarRatings.propTypes = {
  rating: PropTypes.number.isRequired,
};

const ListingProduct = () => {
  const { setActiveConversation, checkConversationExists } =
    useContext(ChatContext);

  const [currentImage, setCurrentImage] = useState(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/supplier/listing/${listingId}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      setCurrentImage(data.images[0]);
    },
  });

  // Check if listing is saved
  useQuery({
    queryKey: ["saved-listing", listingId, currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return false;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/supplier/listing/saved/${currentUser.id}`
      );
      const savedListings = response.data;
      const isListingSaved = savedListings.some(item => item._id === listingId);
      setIsSaved(isListingSaved);
      return isListingSaved;
    },
    enabled: !!currentUser?.id && !!listingId,
  });

  // Fetch reviews separately
  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ["listing-reviews", listingId],
    queryFn: async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/listing-reviews/listing/${listingId}`
      );
      return response.data;
    },
  });

  const recordClickMutation = useMutation({
    mutationFn: () =>
      axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/supplier/listing/analytics/record-click`,
        { listingId }
      ),
    onError: (error) => {
      console.error("Error recording click:", error);
    },
  });

  const recordFavoriteMutation = useMutation({
    mutationFn: () =>
      axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/supplier/listing/analytics/record-favorite`,
        { listingId }
      ),
    onError: (error) => {
      console.error("Error recording favorite:", error);
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: (formData) =>
      axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/listing-reviews/listing/${listingId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ),
    onSuccess: () => {
      setIsReviewDialogOpen(false);
      // Invalidate both queries to refresh the data
      queryClient.invalidateQueries(["listing-reviews", listingId]);
      queryClient.invalidateQueries(["listing", listingId]);
    },
    onError: (error) => {
      console.error("Error submitting review:", error);
    },
  });

  useEffect(() => {
    recordClickMutation.mutate();
  }, [listingId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageClick = (image) => {
    setCurrentImage(image);
  };

  const handleFavorite = async () => {
    if (!currentUser) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/supplier/listing/save/${listingId}`,
        { userId: currentUser.id }
      );
      
      setIsSaved(response.data.isSaved);
      recordFavoriteMutation.mutate();
      
      // Invalidate saved listings query
      queryClient.invalidateQueries(["saved-listing", listingId, currentUser.id]);
      queryClient.invalidateQueries(["saved-listings", currentUser.id]);
    } catch (error) {
      console.error("Error saving listing:", error);
    }
  };

  const handleContact = async () => {
    if (!listing?.supplier?._id) return;

    let conversationId;
    const conversationExists = await checkConversationExists(
      listing.supplier._id,
      currentUser.id
    );

    if (conversationExists) {
      conversationId = conversationExists;
      localStorage.setItem("activeConversation", conversationId);
      navigate("/inbox");
    } else {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/conversations`,
        {
          participant: listing.supplier._id,
          userType: "supplier",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;
      await new Promise((resolve) => {
        setActiveConversation(data._id);
        resolve();
      });

      conversationId = data._id;
      localStorage.setItem("activeConversation", conversationId);
      navigate("/inbox");
    }
  };

  const handleOpenReviewDialog = () => {
    if (!currentUser) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    setIsReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setIsReviewDialogOpen(false);
  };

  const handleSubmitReview = async (formData) => {
    await submitReviewMutation.mutateAsync(formData);
  };

  // Calculate average rating from reviews
  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) /
      reviews.length
    : 0;

  console.log("reviews", reviews);

  if (isLoading) {
    return <ListingDetailsPageLoadingSkeleton />;
  }

  return (
    <div className={styles.listingContainer}>
      <div className={styles.productInfo}>
        <div className={styles.header}>
          <h1 className={styles.productName}>{listing?.name}</h1>
        </div>

        <div className={styles.materialInfo}>
          <div className={styles.rating}>
            <StarRatings rating={averageRating} />
            <span>({reviews.length} reviews)</span>
          </div>

          <div className={styles.specifications}>
            <div className={styles.KEY}>
              <strong>Category:</strong>{" "}
              {listing?.category.charAt(0).toUpperCase() +
                listing?.category.slice(1)}
            </div>
            <div className={styles.KEY}>
              <strong>Brand:</strong> {listing?.brand || "—"}
            </div>
            <div className={styles.KEY}>
              <strong>Stock:</strong>{" "}
              <span
                className={styles.availability}
                style={{
                  backgroundColor: getAvailColor(listing?.availability),
                  color: getAvailTextColor(listing?.availability),
                }}
              >
                {listing?.availability?.replace("_", " ")}
              </span>
            </div>
          </div>

          <div className={styles.priceInfo}>
            <span className={styles.price}>
              {listing?.price?.currency} {listing?.price?.value}
              {listing?.price?.unit && `/ ${listing?.price?.unit}`}
            </span>
          </div>

          <div className={styles.ctaButton}>
            <button 
              className={`${styles.saveButton} ${isSaved ? styles.saved : ''}`} 
              onClick={handleFavorite}
            >
              <FaHeart /> {isSaved ? 'Saved' : 'Save Item'}
            </button>
            <button className={styles.chatButton} onClick={handleContact}>
              <FaCommentDots /> Chat with Supplier
            </button>
          </div>
        </div>

        <div className={styles.descriptionSection}>
          <h3 className={styles.sectionTitle}>Description</h3>
          <div className={styles.description}>
            {listing?.description || "No description provided"}
          </div>
        </div>

        <div className={styles.reviewsSection}>
          <div className={styles.reviewsHeader}>
            <h3 className={styles.sectionTitle}>Customer Reviews</h3>
            <button
              className={styles.writeReviewButton}
              onClick={handleOpenReviewDialog}
            >
              <FaPen /> Write a Review
            </button>
          </div>

          {isLoadingReviews ? (
            <div className={styles.loadingReviews}>Loading reviews...</div>
          ) : reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={review._id || index} className={styles.review}>
                <div className={styles.reviewHeader}>
                  <div className={styles.userAvatar}>
                    {review?.userId?.profilePictureUrl ? (
                      <img
                        className={styles.userAvatarImage}
                        src={review?.userId?.profilePictureUrl}
                        alt={review?.userId?.name}
                      />
                    ) : (
                      "U"
                    )}
                  </div>
                  <div className={styles.reviewMeta}>
                    <div className={styles.reviewUser}>
                      {typeof review.userId === "object"
                        ? review.userId?.name
                        : "User " + review._id.substring(0, 5)}
                    </div>
                    <StarRatings rating={review.rating} />
                    <div className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div className={styles.reviewContent}>
                  &quot;{review.comment}&quot;
                </div>
                {review.image && (
                  <div className={styles.reviewImageContainer}>
                    <img
                      src={review.image}
                      alt="Review"
                      className={styles.reviewImage}
                      onClick={() => window.open(review.image, "_blank")}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noReviews}>
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.imageGallery}>
        {listing?.images?.length ? (
          <div className={styles.imageContainer}>
            <img
              src={currentImage || listing?.images[0]}
              alt={listing?.name}
              className={styles.primaryImage}
            />
            <div className={styles.imageThumbnails}>
              {listing?.images?.map((image, index) => (
                <img
                  onClick={() => handleImageClick(image)}
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={styles.thumbnail}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.noImage}>
            <i className="fas fa-image"></i>
            <div>No images available</div>
          </div>
        )}

        <div className={styles.supplierSection}>
          <p className={styles.supplierSectionTitle}>Supplier</p>

          <Link to={`/supplier-profile/${listing?.supplier?._id}`}>
            <div className={styles.supplierCard}>
              <div className={styles.image}>
                {listing?.supplier?.logo ? (
                  <img src={listing?.supplier?.logo} alt="Supplier Logo" />
                ) : (
                  <div className={styles.placeholder} />
                )}
              </div>
              <div className={styles.content}>
                <h3>{listing?.supplier?.businessName}</h3>
                <p className={styles.supplierLocation}>
                  {listing?.supplier?.address}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <ListingReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={handleCloseReviewDialog}
        onSubmit={handleSubmitReview}
        listingId={listingId}
      />
    </div>
  );
};

function getAvailColor(status) {
  if (status === "in_stock") return "#4CAF50";
  if (status === "pre_order") return "#FF9800";
  return "#F44336";
}

function getAvailTextColor(status) {
  if (status === "in_stock" || status === "pre_order") return "white";
  return "white";
}

export default ListingProduct;
