const express = require("express");
const router = express.Router();
const ListingReview = require("../models/ListingReview");
const multer = require("multer");
const dotenv = require("dotenv");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const authMiddleware = require("../middlewares/auth");

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
});

// Get all reviews for a specific listing
router.get("/listing/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    const reviews = await ListingReview.find({ listingId })
      .populate("userId", "name profilePictureUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching listing reviews:", error);
    res.status(500).json({ error: "Failed to fetch listing reviews" });
  }
});

// Create a new listing review
router.post(
  "/listing/:listingId",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const listingId = req.params.listingId;
      const userId = req.user._id;

      if (!rating || !comment) {
        return res.status(400).json({
          error: "Rating and comment are required",
        });
      }

      const review = new ListingReview({
        rating: Number(rating),
        comment,
        image: req.file ? req.file.location : null,
        listingId,
        userId,
      });

      await review.save();

      // You could update the listing's average rating here if needed

      console.log("Listing review created successfully", review);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating listing review:", error);
      res.status(500).json({ error: "Failed to create listing review" });
    }
  }
);

module.exports = router;
