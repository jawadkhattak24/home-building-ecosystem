const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const Supplier = require("../models/Supplier");
const Listing = require("../models/Listing");
const User = require("../models/User");

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
    // acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

router.put("/update-profile/:supplierId", async (req, res) => {
  const { formData } = req.body;
  const { supplierId } = req.params;
  console.log("Form data: ", formData, supplierId);

  try {
    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      res.json({ message: "Supplier not found" });
    }

    supplier.businessName = formData.businessName;
    supplier.businessDescription = formData.businessDescription;
    supplier.contact.phone = formData.phone;
    supplier.address = formData.address;
    supplier.contact.email = formData.email;
    supplier.save();

    res
      .status(201)
      .json({ message: "Supplier updated successfully", supplier });
  } catch (err) {
    console.error("An error occurred: ", err);
    res.json(err);
  }
});

router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file.location;
    res.json({ imageUrl });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/logo/:supplierId", upload.single("logo"), async (req, res) => {
  const { supplierId } = req.params;

  try {
    const supplier = await Supplier.findById(supplierId);

    supplier.logo = req.file.location;
    supplier.save();

    res.json(supplier.logo);
  } catch (err) {
    console.error("An error occurred uploading logo: ", err);
    res.json(err);
  }
});

router.post("/listing", async (req, res) => {
  const { userId, ...listingData } = req.body;

  try {
    console.log("Looking for supplier with userId:", userId);
    const supplier = await Supplier.findOne({ userId: userId });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    console.log("Supplier found", supplier);
    const listing = new Listing({
      ...req.body,
      supplier: supplier._id,
    });
    await listing.save();
    res.status(200).json({ message: "Listing submitted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/listing/:listingId", async (req, res) => {
  const { listingId } = req.params;
  try {
    await Listing.findByIdAndDelete(listingId);
    res.status(200).json({ message: "Listing deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/listing/:listingId", async (req, res) => {
  const { listingId } = req.params;
  const { ...listingData } = req.body;
  try {
    const listing = await Listing.findByIdAndUpdate(listingId, listingData, {
      new: true,
    });
    res.status(200).json({ message: "Listing updated", listing });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/listing/analytics/record-impression", async (req, res) => {
  const { listingId } = req.body;
  try {
    const listing = await Listing.findById(listingId);
    listing.analytics.impressions++;
    await listing.save();
    res.status(200).json({ message: "Listing analytics updated", listing });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/listing/analytics/record-click", async (req, res) => {
  const { listingId } = req.body;
  try {
    const listing = await Listing.findById(listingId);
    listing.analytics.clicks++;
    await listing.save();
    res.status(200).json({ message: "Listing analytics updated", listing });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/listing/analytics/record-favorite", async (req, res) => {
  const { listingId } = req.body;
  try {
    const listing = await Listing.findById(listingId);
    listing.analytics.favorites++;
    await listing.save();
    res.status(200).json({ message: "Listing analytics updated", listing });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/listing/:listingId", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId).populate(
      "supplier",
      "businessName logo businessType address"
    );
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/getSupplier/:supplierId", (req, res) => {
  const { supplierId } = req.params;

  Supplier.findById(supplierId)
    .then((supplier) => {
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500).send("Server error");
    });
});

router.get("/listings/:supplierId", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    const listings = await Listing.find({ supplier: supplier._id });
    if (!listings) {
      return res.status(404).json({ message: "Listings not found" });
    }
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/search", async (req, res) => {
  const { query, category, location, minPrice, maxPrice, rating, sort } =
    req.query;

  const smallCaseCategory = category ? category.toLowerCase() : null;

  console.log("Category: ", smallCaseCategory);

  try {
    let searchCriteria = {};
    let sortCriteria = {};

    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { keywords: { $regex: query, $options: "i" } },
      ];
    }

    if (category && category !== "All Categories") {
      searchCriteria.category = smallCaseCategory;
    }

    if (location) {
      searchCriteria["supplier.location"] = { $regex: location, $options: "i" };
    }

    if (minPrice || maxPrice) {
      searchCriteria["price.value"] = {};
      if (minPrice) searchCriteria["price.value"].$gte = Number(minPrice);
      if (maxPrice) searchCriteria["price.value"].$lte = Number(maxPrice);
    }

    if (rating) {
      searchCriteria.rating = { $gte: Number(rating) };
    }

    switch (sort) {
      case "price-asc":
        sortCriteria["price.value"] = 1;
        break;
      case "price-desc":
        sortCriteria["price.value"] = -1;
        break;
      case "rating":
        sortCriteria.rating = -1;
        break;
      default:
        sortCriteria.rating = -1;
        sortCriteria["price.value"] = 1;
    }

    const listings = await Listing.find(searchCriteria)
      .populate("supplier", "name contact location")
      .sort(sortCriteria);

    console.log("Price Range: ", minPrice, maxPrice);
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/listing/:id", async (req, res) => {
  const { listingId } = req.params.listingId;
  try {
    const listing = await Listing.findById(listingId).populate(
      "supplier",
      "businessName logo contact"
    );
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/listings/category/:category", async (req, res) => {
  const { category } = req.params;

  try {
    const listings = await Listing.find({ category: category });
    if (listings.length === 0) {
      return res.json("No listings found bro");
    }

    res.status(200).json(listings);
  } catch (err) {
    console.log("Error occured: ", err);
  }
});

router.get("/test", async (req, res) => {
  res.json({ message: "Hello World" });
});

router.post("/listing/save/:listingId", async (req, res) => {
  const { listingId } = req.params;
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const isListingSaved = user.savedListings.includes(listingId);

    if (isListingSaved) {
      user.savedListings = user.savedListings.filter(
        (id) => id.toString() !== listingId
      );
      await user.save();
      return res
        .status(200)
        .json({ message: "Listing unsaved successfully", isSaved: false });
    } else {
      user.savedListings.push(listingId);
      await user.save();
      return res
        .status(200)
        .json({ message: "Listing saved successfully", isSaved: true });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/listing/saved/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate({
      path: "savedListings",
      populate: {
        path: "supplier",
        select: "businessName logo businessType address",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.savedListings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/reviews/:supplierId", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.supplierId)
      .populate({
        path: 'reviews.user',
        select: 'name profilePictureUrl'
      });

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json(supplier.reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
