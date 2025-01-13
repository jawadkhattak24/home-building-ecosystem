const express = require("express");
const router = express.Router();

// const authMiddleware = require("../middlewares/auth");
// const multer = require("multer");
// const multerS3 = require("multer-s3");
// const { S3Client } = require("@aws-sdk/client-s3");

const Professional = require("../models/Professional");
const User = require("../models/User");

router.get("/test", (req, res) => {
  res.json({ message: "Test route working" });
});

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.AWS_BUCKET_NAME,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     // acl: 'public-read',
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString() + "-" + file.originalname);
//     },
//   }),
// });

// router.get("/search", async (req, res) => {
//   const { query } = req.query;
//   try {
//     const services = await Professional.find({
//       title: { $regex: query, $options: "i" },
//     });
//     res.json(services);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.get("/search", async (req, res) => {
  const { query } = req.query;
  try {
    const services = await Professional.find({
      serviceType: { $regex: query, $options: "i" },
    })
      .limit(5)
      .populate("userId", "name profilePictureUrl coverPictureUrl");
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  console.log("Category: ", category);
  try {
    const professionals = await Professional.find({
      serviceType: { $regex: `^${category}$`, $options: "i" }
    })
      .sort({ _id: -1 })
      .populate({
        path: "userId",
        select: "name profilePictureUrl coverPictureUrl",
      });

    console.log("Professionals found: ", professionals);

    if (professionals.length === 0) {
      return res.status(404).json({ message: "No professionals found" });
    }

    res.json(professionals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// router.get("/category/:category", async (req, res) => {
//   // console.log("Fetching featured services");
//   const { category } = req.params;
//   try {
//     const services = await Service.find({ category })
//       .sort({ _id: -1 })
//       .limit(3);
//     res.json(services);
//     if (!services) {
//       return res.status(404).json({ message: "No services found" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.get("/user", authMiddleware, async (req, res) => {
//   try {
//     const { serviceId } = req.params;
//     // console.log(serviceId);
//     const userId = req.user._id;
//     const services = await Service.find({ user: userId });
//     res.json({ services });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.get("/user", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const services = await Service.find({ user: userId }).select(
//       "title images impressions clicks conversions"
//     );

//     const servicesWithAnalytics = services.map((service) => ({
//       _id: service._id,
//       title: service.title,
//       images: service.images,
//       impressions: service.impressions,
//       clicks: service.clicks,
//       conversions: service.conversions,
//       conversionRate:
//         service.clicks > 0 ? (service.conversions / service.clicks) * 100 : 0,
//     }));

//     res.json({ services: servicesWithAnalytics });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.use((req, res, next) => {
//   console.log("Incoming request:", req.method, req.url);
//   console.log("Request headers:", req.headers);
//   console.log("Request body:", req.body);
//   next();
// });

// // const ethers = require("ethers");
// // const ServiceFactoryArtifact = require("../../smart-contracts/artifacts/contracts/ServiceFactory.sol/ServiceFactory.json");

// router.post(
//   "/create",
//   authMiddleware,
//   upload.array("images", 5),
//   async (req, res) => {
//     try {
//       console.log("Request Body:", req.body);
//       const { title, description, category, serviceProvider, startingPrice } =
//         req.body;

//       const userId = req.user._id;
//       const imageUrls = req.files.map((file) => file.location);

//       const user = await User.findById(userId);
//       const providerProfilePicture = user.profilePictureUrl;

//       const service = new Service({
//         title,
//         description,
//         category,
//         user: userId,
//         images: imageUrls,
//         serviceProvider,
//         providerProfilePicture,
//         startingPrice,
//       });

//       await service.save();

//       res
//         .status(201)
//         .json({ message: "Service created successfully", service });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         message: "Server error",
//         error: error.message,
//       });
//     }
//   }
// );

// router.put("/:serviceId", async (req, res) => {
//   try {
//     const { serviceId } = req.params;
//     const { title, description, startingPrice, category, thumbnailUrl } =
//       req.body;
//     const service = await Service.findById(serviceId);

//     if (!service) {
//       return res.status(404).json({ message: "Service not found" });
//     }

//     if (service.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     service.title = title;
//     service.description = description;
//     service.startingPrice = startingPrice;
//     service.category = category;
//     service.thumbnailUrl = thumbnailUrl;
//     service.updatedOn = new Date();

//     await service.save();

//     res.json({ message: "Service updated successfully", service });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.delete("/:serviceId", async (req, res) => {
//   try {
//     const { serviceId } = req.params;
//     const service = await Service.findById(serviceId);

//     if (!service) {
//       return res.status(404).json({ message: "Service not found" });
//     }

//     if (service.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     await Service.findByIdAndDelete(serviceId);

//     res.json({ message: "Service deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.get("/:serviceId", async (req, res) => {
//   try {
//     const { serviceId } = req.params;
//     const service = await Service.findById(serviceId);

//     console.log("Service found: ", service);
//     const provider = await User.findById(service.user);

//     if (!service) {
//       return res.status(404).json({ message: "Service not found" });
//     }

//     res.json({ service, provider });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });







// router.post("/:serviceId/impression", async (req, res) => {
//   try {
//     const { serviceId } = req.params;
//     const service = await Service.findByIdAndUpdate(
//       serviceId,
//       { $inc: { impressions: 1 } },
//       { new: true }
//     );
//     if (!service) {
//       return res.status(404).json({ message: "Service not found" });
//     }
//     res.json({
//       message: "Impression recorded",
//       impressions: service.impressions,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.post("/:serviceId/click", async (req, res) => {
//   try {
//     const { serviceId } = req.params;
//     const service = await Service.findByIdAndUpdate(
//       serviceId,
//       { $inc: { clicks: 1 } },
//       { new: true }
//     );
//     if (!service) {
//       return res.status(404).json({ message: "Service not found" });
//     }
//     res.json({ message: "Click recorded", clicks: service.clicks });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.post("/:serviceId/conversion", async (req, res) => {
//   try {
//     const { serviceId } = req.params;
//     const service = await Service.findByIdAndUpdate(
//       serviceId,
//       { $inc: { conversions: 1 } },
//       { new: true }
//     );
//     if (!service) {
//       return res.status(404).json({ message: "Service not found" });
//     }
//     res.json({
//       message: "Conversion recorded",
//       conversions: service.conversions,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.get("/:serviceId/analytics", authMiddleware, async (req, res) => {
//   try {
//     const { serviceId } = req.params;
//     const service = await Service.findById(serviceId);

//     if (!service) {
//       return res.status(404).json({ message: "Service not found" });
//     }

//     if (service.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     const analytics = {
//       impressions: service.impressions,
//       clicks: service.clicks,
//       conversions: service.conversions,
//       conversionRate:
//         service.clicks > 0 ? (service.conversions / service.clicks) * 100 : 0,
//     };

//     res.json(analytics);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });


module.exports = router;
