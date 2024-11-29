const express = require("express");
const router = express.Router();
const User = require("../models/User");
const dotenv = require("dotenv");
const axios = require("axios");
const { sendVerificationEmail } = require("../utils/emailService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EmailVerification = require("../models/EmailVerification");
const Professional = require("../models/Professional");
const Supplier = require("../models/Supplier");

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

router.get("/check-username", async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ msg: "Username is required" });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(200)
        .json({ available: false, msg: "Username is already taken" });
    }

    return res
      .status(200)
      .json({ available: true, msg: "Username is available" });
  } catch (err) {
    console.error("Error checking username availability:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/test", async (req, res) => {
  res.json({ msg: "Test route working" });
});

router.get("/check-email", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(200)
        .json({ available: false, msg: "Email is already registered" });
    }

    return res.status(200).json({ available: true, msg: "Email is available" });
  } catch (err) {
    console.error("Error checking email availability:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/update-user-type", async (req, res) => {
  try {
    const { userType } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findByIdAndUpdate(userId, { userType });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating user type:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

const verifyTokenFromCookie = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    let user;
    if (decoded.id !== undefined) {
      user = await User.findById(decoded.id).select("-password");
    } else if (decoded.googleId !== undefined) {
      user = await User.findOne({ googleId: decoded.googleId }).select(
        "-password"
      );
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let supplier;
    let professional;

    if (user.userType === "supplier") {
      supplier = await Supplier.findOne({ userId: user._id });
    } else if (user.userType === "professional") {
      professional = await Professional.findOne({ userId: user._id });
    }

    const profileComplete = supplier || professional;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        userType: user.userType,
        name: user.name,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl,
        profileComplete,
      },
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      name: { $regex: query, $options: "i" },
    });
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received signin request for email:", email);

    let user = await User.findOne({ email });

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ msg: "Incorrect email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({ msg: "Incorrect password" });
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          console.error("Error signing JWT token:", err);
          throw err;
        }

        res.json({ user: payload, token });
      }
    );
  } catch (err) {
    console.error("Server error in signin route:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  const defaultAvatar =
    "https://servicesthumbnailbucket.s3.ap-south-1.amazonaws.com/profile_avatar.jpg";
  const defaultCover =
    "https://servicesthumbnailbucket.s3.ap-south-1.amazonaws.com/defaultCover.png";

  try {
    const { userType, name, email, password } = req.body;
    // const ip = req.ip;
    // console.log("IP in register route:", ip);
    // console.log("IP in register route:", req.socket.remoteAddress);

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const username = name.split(" ").join("").toLowerCase();

    user = new User({
      userType,
      name,
      username,
      email,
      password,
      profilePictureUrl: defaultAvatar,
      coverPictureUrl: defaultCover,
      isVerified: true,
    });

    await user.save();

    if (userType === "homeowner") {
      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl,
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
        (err, token) => {
          if (err) {
            console.error("Error signing JWT token:", err);
            throw err;
          }

          res.status(200).json({ user: payload, token });
        }
      );
    } else {
      res.status(200).json({ msg: "User registered successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error (Error occured in backend)",
      error: err.message || err.toString(),
    });
  }
});

router.post("/send-verification", async (req, res) => {
  try {
    const { email } = req.body;
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Verification code ki expiry 10 minutes rakhi hai
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000;

    let user = await EmailVerification.findOne({ email });

    if (!user) {
      user = new EmailVerification({
        email,
        verificationCode: 96925,
        verificationCodeExpires,
      });
      await user.save();
    } else {
      user.verificationCode = 96925;
      user.verificationCodeExpires = verificationCodeExpires;
      await user.save();
    }

    // await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: "Verification code sent to your email" });
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

router.post("/verify-code", async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    console.log("Email in verify-code endpoint:", email);
    let user = await EmailVerification.findOne({ email });

    console.log("User in verify-code endpoint:", user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("Verification code in verify-code endpoint:", verificationCode);
    console.log(
      "User verification code in verify-code endpoint:",
      user.verificationCode
    );
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
    res.status(500).json({
      message: "Error verifying verification code",
      error: err.message || err.toString(),
    });
  }
});

router.post("/professional/profile", async (req, res) => {
  console.log("Received professional profile data:", req.body);

  try {
    const {
      email,
      serviceType,
      yearsExperience,
      bio,
      certifications,
      portfolioLink,
    } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const professional = new Professional({
      userId: user._id,
      serviceType,
      yearsExperience,
      bio,
      certifications,
      portfolioLink,
    });

    await professional.save();

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ user: payload, token });
      }
    );
  } catch (err) {
    console.error("Error creating professional profile:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/supplier/profile", async (req, res) => {
  console.log("Received supplier profile data:", req.body);

  try {
    const { email, businessName, contactInfo, additionalDetails } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const supplier = new Supplier({
      userId: user._id,
      businessName,
      contactInfo,
      additionalDetails,
    });

    await supplier.save();

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ user: payload, token });
      }
    );
  } catch (err) {
    console.error("Error creating supplier profile:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ msg: "Logged out successfully" });
});

module.exports = router;
