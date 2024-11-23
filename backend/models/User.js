const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: function () {
      return !this.googleId && !this.facebookId;
    },
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId && !this.facebookId;
    },
  },
  profilePictureUrl: {
    type: String,
    default: "",
  },
  coverPictureUrl: {
    type: String,
    default: "",
  },

  verificationCode: String,
  verificationCodeExpires: Date,
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
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
