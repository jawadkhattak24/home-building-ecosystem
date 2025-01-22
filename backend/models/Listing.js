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
      required: true,
      index: true,
    },
    description: String,
    price: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ["sqft", "kg", "ton", "piece", "box"],
        required: true,
      },
      currency: {
        type: String,
        default: "PKR",
      },
    },
    specifications: {
      brand: String,
      model: String,
      dimensions: String,
      weight: Number,
      color: String,
      materialType: String,
    },
    images: [
      {
        url: String,
        caption: String,
      },
    ],
    stock: {
      quantity: {
        type: Number,
        default: 0,
      },
      updatedAt: Date,
    },
    keywords: [String],
    // discounts: {
    //   type: Map,
    //   of: Number,
    // },
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
    reviews: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
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

