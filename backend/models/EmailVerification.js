const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  verificationCode: String,
  verificationCodeExpires: Date,
});

module.exports = mongoose.model("EmailVerification", emailVerificationSchema);
