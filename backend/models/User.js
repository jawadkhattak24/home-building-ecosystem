const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["homeowner", "professional", "supplier"],
      required: false,
      default: "homeowner",
    },
    hasProfessionalProfile: {
      type: Boolean,
      default: false,
    },
    professionalProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professional",
      default: null,
    },
    hasSupplierProfile: {
      type: Boolean,
      default: false,
    },
    supplierProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      default: null,
    },
    name: { type: String },
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    profilePictureUrl: { type: String },
    coverPictureUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    savedProfiles: { type: [String], default: [] },
    savedListings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing", default: [] }],
    isVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    provider: {
      type: String,
      enum: ["google", "facebook", "local"],
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    city: {
      type: String,
      default: "N/A",
    },
    country: {
      type: String,
      default: "N/A",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await mongoose.model("Professional").deleteMany({ userId: this._id });
  }
);

userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await mongoose.model("Supplier").deleteMany({ userId: this._id });
  }
);

userSchema.virtual("professional", {
  ref: "Professional",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

userSchema.virtual("supplier", {
  ref: "Supplier",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

module.exports = mongoose.model("User", userSchema);
