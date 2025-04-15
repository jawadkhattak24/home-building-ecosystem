const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Professional = require("../models/Professional");
const Supplier = require("../models/Supplier");
const dotenv = require("dotenv");
const axios = require("axios");
const { sendVerificationEmail } = require("../utils/emailService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EmailVerification = require("../models/EmailVerification");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const authMiddleware = require("../middlewares/auth");

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

router.get("/:userId/profile-picture", async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user.profilePictureUrl);
});

router.post(
  "/:userId/profile-picture",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      if (!req.file) {
        return res.status(400).json({ msg: "No profile picture uploaded" });
      }

      user.profilePictureUrl = req.file.location;
      await user.save();

      res.json({ msg: "Profile picture uploaded successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/:userId/cover-picture", async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user.coverPictureUrl);
});

router.post(
  "/:userId/cover-picture",
  upload.single("coverPicture"),
  async (req, res) => {
    console.log("Uploading cover picture");
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      if (!req.file) {
        return res.status(400).json({ msg: "No cover picture uploaded" });
      }

      console.log("Cover picture uploaded successfully");

      user.coverPictureUrl = req.file.location;
      await user.save();

      res.json({ msg: "Cover picture uploaded successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.post(
  "/professional-profile/update-portfolio/:userId",
  upload.array("portfolio", 10),
  async (req, res) => {
    try {
      const { userId } = req.params;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ msg: "No files uploaded" });
      }

      const portfolio = req.files.map((file) => file.location);

      const professional = await Professional.findOne({ userId: userId });
      if (!professional) {
        return res.status(404).json({ msg: "Professional not found" });
      }

      professional.portfolio = [
        ...(professional.portfolio || []),
        ...portfolio,
      ];
      await professional.save();

      res.json({
        msg: "Portfolio uploaded successfully",
        portfolio: professional.portfolio,
      });
    } catch (err) {
      console.error("Error uploading portfolio:", err);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

router.put("/professional-profile/update/:field/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const field = req.params.field;

    console.log("Update info: ", userId, field, req.body);

    const { dataToSend } = req.body;

    if (field === "name") {
      const user = await User.findById(userId);
      console.log("Name change request recieved: ", user);

      if (!user) {
        res.status(400).json({ msg: "User not found" });
      }
      user.name = dataToSend;
      await user.save();

      res.status(201).json({ msg: "Profile updated successfully" });
    } else {
      const user = await User.findById(userId);

      const pro = await Professional.findOne({ userId: userId });

      if (field == "serviceType") {
        await Professional.findByIdAndUpdate(
          pro._id,
          { serviceType: dataToSend },
          { new: true, runValidators: true }
        );
      } else if (field == "bio") {
        await Professional.findByIdAndUpdate(
          pro._id,
          { bio: dataToSend },
          { new: true, runValidators: true }
        );
      } else if (field == "qualifications") {
        await Professional.findByIdAndUpdate(
          pro._id,
          { qualifications: dataToSend },
          { new: true, runValidators: true }
        );
      } else if (field == "yearsExperience") {
        await Professional.findByIdAndUpdate(
          pro._id,
          { yearsExperience: dataToSend },
          { new: true, runValidators: true }
        );
      } else if (field == "address") {
        await Professional.findByIdAndUpdate(
          pro._id,
          { address: dataToSend },
          { new: true, runValidators: true }
        );
      } else if (field == "ratePerHour") {
        await Professional.findByIdAndUpdate(
          pro._id,
          { ratePerHour: dataToSend },
          { new: true, runValidators: true }
        );
      } else if (field == "certifications") {
        await Professional.findByIdAndUpdate(
          pro._id,
          { certifications: dataToSend },
          { new: true, runValidators: true }
        );
      }

      if (!user) {
        res.status(400).json({ msg: "User not found" });
      }

      res.status(201).json({ msg: "Profile updated successfully" });
    }
  } catch (err) {
    console.error("An error occured updating profile:", err);
  }
});

router.get("/check-profile-setup/:userId", async (req, res) => {
  const { userId } = req.params;
  const { userType } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  if (user.userType === "supplier") {
    const supplier = await Supplier.findOne({ userId });
    if (supplier) {
      return res.status(200).json({ isProfileSetup: true });
    } else {
      return res.status(200).json({ isProfileSetup: false });
    }
  } else if (user.userType === "professional") {
    const professional = await Professional.findOne({ userId });
    if (professional) {
      return res.status(200).json({ isProfileSetup: true });
    } else {
      return res.status(200).json({ isProfileSetup: false });
    }
  }
});

router.put("/switch-userType/:userId", async (req, res) => {
  const { userId } = req.params;
  const { userType } = req.body;

  console.log("Switching user type to:", userType);

  try {
    const user = await User.findById(userId);
    console.log("User found:", user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!["professional", "supplier", "homeowner"].includes(userType)) {
      return res.status(400).json({ msg: "Invalid user type" });
    }

    if (userType === "homeowner") {
      user.userType = "homeowner";
      await user.save();
      return res
        .status(200)
        .json({ msg: "User type updated to homeowner", user });
    }

    if (userType === "professional") {
      const existingProfessional = await Professional.findOne({ userId });
      console.log("Existing professional:", existingProfessional);
      if (!existingProfessional && !user.hasProfessionalProfile) {
        const professional = await Professional.create({ userId });
        user.hasProfessionalProfile = true;
        user.professionalProfileId = professional._id;
        await user.save();
      }
    }

    if (userType === "supplier") {
      const existingSupplier = await Supplier.findOne({ userId });
      if (!existingSupplier && !user.hasSupplierProfile) {
        const supplier = await Supplier.create({ userId });
        user.hasSupplierProfile = true;
        user.supplierProfileId = supplier._id;
        await user.save();
      }
    }

    user.userType = userType;
    console.log("User type updated to:", userType);
    const updatedUser = await user.save();
    console.log("Updated user:", updatedUser);

    res.status(200).json({
      message: "User type updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("An error occurred updating userType:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/professional/save/:professionalId", async (req, res) => {
  const { professionalId } = req.params;
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    console.log("User ID:", userId);
    console.log("User saved profiles:", user.savedProfiles);
    console.log("Professional ID:", professionalId);
    const professional = await Professional.findOne({ userId: professionalId });
    console.log("Professional found:", professional);

    if (!professional || !user) {
      return res.status(404).json({ msg: "Professional or User not found" });
    }

    if (user.savedProfiles.includes(professionalId)) {
      return res
        .status(400)
        .json({ msg: "Profile already saved", savedProfiles: user });
    }

    professional.analytics.saveCount =
      (professional.analytics.saveCount || 0) + 1;
    await professional.save();

    user.savedProfiles.push(professional.userId);
    await user.save();

    res.status(200).json({
      msg: "Profile saved successfully",
      savedProfiles: user,
    });
  } catch (err) {
    console.error("Error saving profile:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.delete("/professional/unsave/:professionalId", async (req, res) => {
  const { professionalId } = req.params;
  const { userId } = req.body;

  console.log("Unsave request recieved:", professionalId, userId);

  try {
    console.log("User ID:", userId);
    console.log("Professional ID:", professionalId);

    const user = await User.findById(userId);
    console.log("User saved profiles:", user.savedProfiles);

    const professional = await Professional.findOne({ userId: professionalId });
    console.log("Professional found:", professional);

    if (!professional) {
      return res.status(404).json({ msg: "Professional or User not found" });
    }

    if (!user.savedProfiles.includes(professionalId)) {
      return res.status(400).json({ msg: "Profile not saved" });
    }

    professional.analytics.saveCount = Math.max(
      (professional.analytics.saveCount || 0) - 1,
      0
    );
    await professional.save();

    user.savedProfiles = user.savedProfiles.filter(
      (id) => id.toString() !== professional.userId
    );
    await user.save();

    res.status(200).json({
      msg: "Profile unsaved successfully",
      savedProfiles: user.savedProfiles,
    });
  } catch (err) {
    console.error("Error unsaving profile:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/professional-analytics/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const professional = await Professional.findOne({ userId });
    res.json(professional.analytics);
  } catch (err) {
    console.error("An error occured fetching professional analytics:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/setup-profile/:userId", async (req, res) => {
  const { userId } = req.params;
  const { userType } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.userType === "supplier") {
      const supplier = new Supplier({ userId });
      await supplier.save();
    } else if (user.userType === "professional") {
      const professional = new Professional({ userId });
      await professional.save();
    }

    res.status(200).json({ isProfileSetup: true });
  } catch (err) {
    console.error("Error setting up profile:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

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

    const user = await User.findByIdAndUpdate(
      userId,
      { userType },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("UserType updated in api:", user);
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
  // console.log("Auth header in me route:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded);

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
        savedProfiles: user.savedProfiles,
        supplierProfileId: user.supplierProfileId,
        professionalProfileId: user.professionalProfileId,
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

router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("User Found:", user);
    res.json(user);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:professionalId/impression", async (req, res) => {
  try {
    const { professionalId } = req.params;
    const professional = await Professional.findByIdAndUpdate(
      professionalId,
      { $inc: { "analytics.impressions": 1 } },
      { new: true }
    );
    if (!professional) {
      return res.status(404).json({ message: "Professional not found" });
    }
    res.json({
      message: "Impression recorded",
      impressions: professional.analytics.impressions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/professional/:professionalId/click", async (req, res) => {
  const { professionalId } = req.params;
  try {
    const professional = await Professional.findByIdAndUpdate(
      professionalId,
      { $inc: { "analytics.clicks": 1 } },
      { new: true }
    );
    res.json({
      message: "Click recorded",
      clicks: professional.analytics.clicks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/professional/:userId", async (req, res) => {
  try {
    console.log("Fetching professional data for: ", req.params.userId);
    const { userId } = req.params;
    const professional = await Professional.findOne({ userId }).populate(
      "userId",
      "name email profilePictureUrl"
    );
    console.log("Professional found:", professional);

    if (!professional) {
      return res.status(400).json("Professional does not exist");
    }
    console.log("Professional Found:", professional);

    res.json(professional);
  } catch (err) {
    console.error("Error fetching professional data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/saved-professionals/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const professional = await Professional.findOne({ userId }).populate(
      "userId",
      "name email profilePictureUrl"
    );
    res.json(professional);
  } catch (err) {
    console.error("Error fetching professional data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/supplier/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const supplier = await Supplier.findOne({ userId });
  res.json(supplier);
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
    if (user.googleId) {
      return res.status(400).json({ msg: "Login with Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({ msg: "Incorrect password" });
    }

    const supplier = await Supplier.findOne({ userId: user._id });
    const professional = await Professional.findOne({ userId: user._id });

    const payload = {
      id: user._id,
      userType: user.userType,
      name: user.name,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
      supplierProfileId: supplier ? supplier._id : null,
      professionalProfileId: professional ? professional._id : null,
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
    const { name, email, password } = req.body;

    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    let location = { city: "Unknown", country: "Unknown" };
    try {
      const geoResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
      if (geoResponse.data.status === "success") {
        location = {
          city: geoResponse.data.city,
          country: geoResponse.data.country,
        };
      }
    } catch (geoError) {
      console.error("Error fetching location:", geoError);
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const username = name.split(" ").join("").toLowerCase();

    user = new User({
      userType: "homeowner",
      name,
      username,
      email,
      password,
      profilePictureUrl: defaultAvatar,
      coverPictureUrl: defaultCover,
      isVerified: true,
      city: location.city,
      country: location.country,
    });

    await user.save();

    const payload = {
      userType: user.userType,
      id: user._id,
      name: user.name,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
      city: user.city,
      country: user.country,
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
        verificationCode: verificationCode,
        verificationCodeExpires,
      });
      await user.save();
    } else {
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = verificationCodeExpires;
      await user.save();
    }

    await sendVerificationEmail(email, verificationCode);

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
    console.log("User in professional profile route:", user);

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

router.get("/supplier-profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const supplier = await Supplier.findOne({ userId }).populate(
      "userId",
      "name email profilePictureUrl coverPictureUrl"
    );
    res.json(supplier);
    console.log("Supplier profile fetched:", supplier);
  } catch (err) {
    console.error("Error fetching supplier profile:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ msg: "Logged out successfully" });
});

router.delete(
  "/professional-profile/delete-portfolio/:userId/:index",
  async (req, res) => {
    try {
      const { userId, index } = req.params;

      const professional = await Professional.findOne({ userId: userId });
      if (!professional) {
        return res.status(404).json({ msg: "Professional not found" });
      }

      professional.portfolio.splice(index, 1);
      await professional.save();

      res.json({
        msg: "Portfolio image deleted successfully",
        portfolio: professional.portfolio,
      });
    } catch (err) {
      console.error("Error deleting portfolio image:", err);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

module.exports = router;
