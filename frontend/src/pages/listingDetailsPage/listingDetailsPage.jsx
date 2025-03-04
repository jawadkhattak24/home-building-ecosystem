import { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import styles from "./styles/listingDetailsPage.module.scss";
import StarRatings from "../../components/starRating/starRating";
import { FaHeart, FaCommentDots } from "react-icons/fa";
import { ChatContext } from "../../contexts/chatContext";
import { useAuth } from "../../contexts/authContext";
import ListingDetailsPageLoadingSkeleton from "./loadingSkeleton/listingDetailsPageLoadingSkeleton";

const ListingProduct = () => {
  const { setActiveConversation, checkConversationExists } =
    useContext(ChatContext);

  const [currentImage, setCurrentImage] = useState(null);
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

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

  useEffect(() => {
    recordClickMutation.mutate();
  }, [listingId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageClick = (image) => {
    setCurrentImage(image);
  };

  const handleFavorite = () => {
    recordFavoriteMutation.mutate();
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
            <StarRatings rating={listing?.rating} />
            <span>({listing?.reviews?.length} reviews)</span>
          </div>

          <div className={styles.specifications}>
            <div className={styles.KEY}>
              <strong>Category:</strong> {listing?.category}
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
            <button className={styles.saveButton} onClick={handleFavorite}>
              <FaHeart /> Save Item
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

        <div className={styles.documentsSection}>
          <h3 className={styles.sectionTitle}>Documents</h3>
          {listing?.safetyDataSheet ? (
            <a
              href={listing?.safetyDataSheet}
              target="_blank"
              rel="noopener"
              className={styles.documentLink}
            >
              <i className="fas fa-file-pdf"></i> Safety Data Sheet
            </a>
          ) : null}
          {listing?.installationGuide ? (
            <a
              href={listing?.installationGuide}
              target="_blank"
              rel="noopener"
              className={styles.documentLink}
            >
              <i className="fas fa-file-pdf"></i> Installation Guide
            </a>
          ) : null}
        </div>

        <div className={styles.reviewsSection}>
          <h3 className={styles.sectionTitle}>Customer Reviews</h3>
          {listing?.reviews?.map((review, index) => (
            <div key={index} className={styles.review}>
              <div className={styles.reviewHeader}>
                <div className={styles.userAvatar}>{review?.user?.name[0]}</div>
                <div className={styles.reviewMeta}>
                  <StarRatings rating={review?.rating} />
                  <div className={styles.reviewDate}>
                    {new Date(review?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className={styles.reviewContent}>
                &quot;{review?.comment}&quot;
              </div>
            </div>
          ))}
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
            </div>
          </div>
        </Link>
      </div>
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
