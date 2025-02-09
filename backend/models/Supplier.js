const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    userId: {
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
      required: false,
      index: true,
      default: "Your business name"
    },
    businessDescription: {
      type: String,
      default: "Your business description",

    },
    businessType: {
      type: String,
      enum: ["manufacturer", "distributor", "retailer", "wholesaler"],
      required: false,
      default: "Your business type"
    },
    businessRegistration: {
      number: String,
      document: String,
    },
    contact: {
      phone: { type: String, default: "Your phone number" },
      website: { type: String, default: "Your website address" },
      socialMedia: {
        facebook: String,
        linkedin: String,
        instagram: String,
      },
    },
    address: {
      default: "Your address",
      street: { type: String, default: "Your street address" },
      city: { type: String, default: "Your city" },
      state: { type: String, default: "Your state" },
      country: { type: String, default: "Your country" },
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

module.exports =
  mongoose.models.Supplier || mongoose.model("Supplier", supplierSchema);
