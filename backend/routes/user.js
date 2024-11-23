const express = require("express");
const router = express.Router();
const User = require("../models/User");
const dotenv = require("dotenv");
const axios = require("axios");
const { sendVerificationEmail } = require("../utils/emailService");

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });


router.post("/register", async (req, res) => {
  const defaultAvatar =
    "https://servicesthumbnailbucket.s3.ap-south-1.amazonaws.com/profile_avatar.jpg";
  const defaultCover =
    "https://servicesthumbnailbucket.s3.ap-south-1.amazonaws.com/defaultCover.png";

  try {
    const { name, username, email, password } = req.body;
    const ip = req.ip;
    console.log("IP in register route:", ip);
    console.log("IP in register route:", req.socket.remoteAddress);

    // const locationResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
    // const locationData = locationResponse.data;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      name,
      username,
      email,
      password,
      profilePictureUrl: defaultAvatar,
      coverPictureUrl: defaultCover,

      verificationCode: undefined,
      verificationCodeExpires: undefined,
      isVerified: false,
    });

    await user.save();

    return res.status(200).json({
      msg: "User registered successfully, please verify your email",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Server error", error: err.message || err.toString() });
  }
});

router.post("/send-verification", async (req, res) => {
  try {
    const { email } = req.body;
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    let user = await User.findOne({ email });
    if (user) {
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = verificationCodeExpires;
    } else {
      console.log("Problem in finding user, we'll handle this later");
    }

    await sendVerificationEmail(email, verificationCode);

    res.json({ message: "Verification code sent to your email" });
  } catch (err) {
    console.error(
      "Error sending verification code (Error occured in backend)",
      err
    );

    res.status(500).json({
      message: "Error sending verification code (Error occured in backend)",
      error: err.message || err.toString(),
    });
  }
});

router.get("/verify-code", async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ email });
    console.log("User in verify-code endpoint:", user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ msg: "Invalid verification code" });
    }
    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ msg: "Verification code expired" });
    }

    console.log("User data for payload:", JSON.stringify(user, null, 2));

    res.data = {
      success: true,
      message: "Verification code verified successfully",
    };
    res.status(200).json(res.data);
  } catch (err) {
    console.error("Error verifying verification code", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
