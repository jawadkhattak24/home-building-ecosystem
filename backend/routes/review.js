const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
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

// Get reviews for a professional
router.get("/professional/:professionalId", async (req, res) => {
  try {
    const { professionalId } = req.params;
    const reviews = await Review.find({ professionalId })
      .populate('userId', 'name profilePictureUrl')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.post(
  "/professional/:professionalId",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { rating, description } = req.body;
      const professionalId = req.params.professionalId;
      const userId = req.user._id;

      if (!rating || !description) {
        return res.status(400).json({
          error: "Rating and description are required",
        });
      }

      const review = new Review({
        rating: Number(rating),
        description,
        image: req.file ? req.file.location : null,
        professionalId,
        userId,
      });

      await review.save();
      console.log("Review created successfully", review);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ error: "Failed to create review" });
    }
  }
);

module.exports = router;
