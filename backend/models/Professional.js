const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    serviceType: {
      type: String,
      required: false,
      enum: [
        "Architect",
        "Interior Designer",
        "Contractor",
        "Plumber",
        "Painter",
        "Electrician",
        "3D Modeler",
        "Material Supplier",
      ],
    },

    address: { type: String, required: false },
    qualifications: [{ type: String, required: false }],
    ratePerHour: { type: Number, required: false },
    yearsExperience: { type: Number, required: false, default: 7 },
    bio: { type: String, required: false },
    certifications: { type: String },
    portfolio: [String],
    rating: { type: Number, default: 0 },
    saveCount: { type: Number, default: 0 },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String },
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    analytics: {
      type: Object,
      default: {
        impressions: 0,
        clicks: 0,
        saved: 0,
        contacted: 0,
        reviews: 0,
      },
    },
  },
  { timestamps: true }
);

professionalSchema.index({ userId: 1 });

module.exports =
  mongoose.models.Professional ||
  mongoose.model("Professional", professionalSchema);
