const express = require("express");
const router = express.Router();
const Professional = require("../models/Professional");
const User = require("../models/User");

router.get("/test", (req, res) => {
  res.json({ message: "Test route working" });
});

router.get("/search", async (req, res) => {
  const { query, category, location, minPrice, maxPrice, rating, sort } =
    req.query;

  try {
    let searchCriteria = {};
    let sortCriteria = {};

    if (query) {
      searchCriteria.$or = [
        { serviceType: { $regex: query, $options: "i" } },
        { bio: { $regex: query, $options: "i" } }
      ];

      const professionals = await Professional.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $match: {
            $or: [
              { serviceType: { $regex: query, $options: "i" } },
              { bio: { $regex: query, $options: "i" } },
              { 'userInfo.name': { $regex: query, $options: "i" } }
            ]
          }
        }
      ]).exec();

      const matchingIds = professionals.map(p => p._id);
      if (matchingIds.length > 0) {
        searchCriteria = { _id: { $in: matchingIds } };
      }
    }

    if (category && category !== "All Categories") {
      searchCriteria.serviceType = { $regex: category, $options: "i" };
    }

    if (location) {
      searchCriteria.address = { $regex: location, $options: "i" };
    }

    if (minPrice || maxPrice) {
      searchCriteria.ratePerHour = {};
      if (minPrice) searchCriteria.ratePerHour.$gte = Number(minPrice);
      if (maxPrice) searchCriteria.ratePerHour.$lte = Number(maxPrice);
    }

    if (rating) {
      searchCriteria.rating = { $gte: Number(rating) };
    }

    switch (sort) {
      case "price-asc":
        sortCriteria.ratePerHour = 1;
        break;
      case "price-desc":
        sortCriteria.ratePerHour = -1;
        break;
      case "rating":
        sortCriteria.rating = -1;
        break;
      default:
        sortCriteria.rating = -1;
        sortCriteria.ratePerHour = 1;
    }

    const services = await Professional.find(searchCriteria)
      .populate("userId", "name profilePictureUrl coverPictureUrl")
      .sort(sortCriteria);

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
      serviceType: { $regex: `^${category}$`, $options: "i" },
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

module.exports = router;
