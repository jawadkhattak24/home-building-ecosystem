const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  businessName: { type: String, required: true },
  contactInfo: { type: String, required: true },
  additionalDetails: { type: String },
});

supplierSchema.index({ userId: 1 });
module.exports = mongoose.model("Supplier", supplierSchema);
