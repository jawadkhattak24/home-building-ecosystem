import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import styles from "./styles/listingDetailsPage.module.scss";
import StarRatings from "../../components/starRating/starRating";

const ListingProduct = () => {
    const [listing, setListing] = useState(null);
    const {listingId} = useParams();
    const [currentImage, setCurrentImage] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchListingDetails = async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/supplier/listing/${listingId}`
            );
            setListing(response.data);
            setCurrentImage(response.data.images[0]);
        };
        fetchListingDetails();
    }, [listingId]);

    console.log("Listing: ", listing);

    const handleImageClick = (image) => {
        setCurrentImage(image);
    };

    return (
        <div className={styles.listingContainer}>
            <div className={styles.productInfo}>
                <div className={styles.header}>
                    <h1 className={styles.productName}>{listing?.name}</h1>
                    <Link to={`/supplier-profile/${listing?.supplier?._id}`}>

                        <div className={styles.supplierCard}>
                            <div className={styles.image}>
                                {listing?.supplier?.logo ? (
                                    <img src={listing?.supplier?.logo} alt="Supplier Logo"/>
                                ) : (
                                    <div className={styles.placeholder}/>
                                )}
                            </div>
                            <div className={styles.content}>
                                <h3>{listing?.supplier?.businessName}</h3>
                                {/*<p>{listing?.supplier?.contact}</p>*/}
                            </div>
                        </div>
                    </Link>
                </div>

                <div className={styles.materialInfo}>
                    <div className={styles.priceInfo}>
            <span className={styles.price}>
              {listing?.price?.currency} {listing?.price?.value}
                {listing?.price?.unit && `/ ${listing?.price?.unit}`}
            </span>
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

                    <div className={styles.rating}>
                        <StarRatings rating={listing?.rating}/>
                        <span>({listing?.reviews?.length} reviews)</span>
                        <button className={styles.ctaButton}>Add to Quote</button>
                    </div>

                    <div className={styles.specifications}>
                        <div className={styles.KEY}>
                            <strong>Category:</strong> {listing?.category}
                        </div>
                        <div className={styles.KEY}>
                            <strong>Brand:</strong> {listing?.brand || "—"}
                        </div>
                        <div className={styles.KEY}>
                            <strong>Stock:</strong> {listing?.availability || "—"}
                        </div>
                    </div>
                </div>

                <div className={styles.descriptionSection}>
                    <h3 className={styles.sectionTitle}>Description</h3>
                    <div className={styles.description}>
                        {listing?.description || "No description provided"}
                    </div>
                </div>

                {/* <div className={styles.specsSection}>
          <h3 className={styles.sectionTitle}>Specifications</h3>
          {Object.keys(listing?.specifications).length > 0 ? (
            Object.entries(listing?.specifications).map(([key, value]) => (
              <div key={key} className={styles.specItem}>
                <strong>{key}:</strong> {value}
              </div>
            ))
          ) : (
            <div>No specifications available</div>
          )}
        </div> */}

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
                                    <StarRatings rating={review?.rating}/>
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
                            src={currentImage}
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
            </div>
        </div>
    )
        ;
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
