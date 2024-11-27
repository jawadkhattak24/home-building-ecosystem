const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    homeownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String },
    budget: { type: Number },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "closed"],
      default: "open",
    },
    bids: [
      {
        professionalId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        bidAmount: { type: Number },
        message: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    assignedProfessionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
