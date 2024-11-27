const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
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
    yearsExperience: { type: Number, required: true },
    bio: { type: String, required: true },
    certifications: { type: String },
    portfolio: [String],
    rating: { type: Number, default: 0 },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String },
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

professionalSchema.index({ userId: 1 });

module.exports = mongoose.model("Professional", professionalSchema);
