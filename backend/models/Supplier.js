const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    logo: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    businessName: {
      type: String,
      required: true,
      index: true,
    },
    businessDescription: {
      type: String,
      default: "",
    },
    businessType: {
      type: String,
      enum: ["manufacturer", "distributor", "retailer", "wholesaler"],
      required: true,
    },
    businessRegistration: {
      number: String,
      document: String,
    },
    contact: {
      phone: String,
      website: String,
      socialMedia: {
        facebook: String,
        linkedin: String,
        instagram: String,
      },
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
    listings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
    certifications: [String],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
        image: [String],
        rating: Number,
        createdAt: Date,
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    paymentTerms: {
      type: String,
      enum: ["advance", "credit", "partial"],
    },
    deliveryOptions: {
      type: [String],
      enum: ["pickup", "local_delivery", "national_shipping"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplier", supplierSchema);
