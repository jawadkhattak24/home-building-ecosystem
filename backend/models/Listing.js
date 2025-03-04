const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: [
        "cement",
        "tiles",
        "paint",
        "sanitary",
        "bricks",
        "steel",
        "aggregates",
        "plumbing",
        "electrical",
        "wood",
        "finishes",
        "hardware",
      ],
      required: false,
      index: true,
    },
    brand: {
      type: String,
      required: false,
    },
    description: String,
    price: {
      value: {
        type: Number,
        required: false,
      },
      unit: {
        type: String,
        required: false,
      },
      currency: {
        type: String,
        default: "PKR",
      },
    },
    brand: {
      type: String,
      required: false,
    },
    stock: {
      type: Number,
      default: 0,
    },
    specifications: {
      type: Map,
      of: String,
      required: false,
    },
    images: [
      {
        type: String,
      },
    ],
    keywords: [String],

    availability: {
      type: String,
      enum: ["in_stock", "out_of_stock", "pre_order"],
      default: "in_stock",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    analytics: {
      impressions: {
        type: Number,
        default: 0,
      },
      clicks: {
        type: Number,
        default: 0,
      },
      favorites: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
        rating: Number,
        createdAt: Date,
      },
    ],
    certifications: [String],
    safetyDataSheet: String,
    installationGuide: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
