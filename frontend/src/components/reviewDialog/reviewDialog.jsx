import { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  FaStar,
  FaRegStar,
  FaTimes,
  FaCloudUploadAlt,
  FaTrash,
} from "react-icons/fa";
import styles from "./styles/reviewDialog.module.scss";

const ReviewDialog = ({ isOpen, onClose, onSubmit, professionalId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue) => {
    setHoverRating(starValue);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setError("");
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (description.trim() === "") {
      setError("Please provide a review description");
      return;
    }

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("description", description);
    formData.append("professionalId", professionalId);
    if (image) {
      formData.append("image", image);
    }

    // Log each key-value pair in the FormData
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    onSubmit(formData);
    resetForm();
  };

  const resetForm = () => {
    setRating(0);
    setDescription("");
    setImage(null);
    setImagePreview(null);
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className={styles.dialogOverlay} onClick={onClose}>
      <div
        className={styles.dialogContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.dialogHeader}>
          <h2>Write a Review</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.dialogForm}>
          <div className={styles.ratingContainer}>
            <h3>Rate your experience</h3>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  onClick={() => handleStarClick(star)}
                  className={styles.starContainer}
                >
                  {star <= (hoverRating || rating) ? (
                    <FaStar className={styles.starFilled} />
                  ) : (
                    <FaRegStar className={styles.starEmpty} />
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Your Review</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share your experience with this professional..."
              rows={5}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Add Photos (optional)</label>
            <div className={styles.uploadContainer}>
              {imagePreview ? (
                <div className={styles.previewContainer}>
                  <img
                    src={imagePreview}
                    alt="Review"
                    className={styles.imagePreview}
                  />
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={removeImage}
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <div className={styles.uploadZone}>
                  <input
                    type="file"
                    id="review-image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    ref={fileInputRef}
                  />
                  <label htmlFor="review-image" className={styles.uploadLabel}>
                    <FaCloudUploadAlt className={styles.uploadIcon} />
                    <span>Upload Image</span>
                  </label>
                </div>
              )}
            </div>
            {/* <p className={styles.uploadNote}>
              Accepted formats: JPG, PNG, WEBP (Max 5MB)
            </p> */}
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.dialogButtons}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ReviewDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  professionalId: PropTypes.string.isRequired,
};

export default ReviewDialog;
