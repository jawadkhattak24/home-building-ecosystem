const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  // console.log("Auth middleware called");
  try {
    // console.log("Auth header:", req.header("Authorization"));
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      throw new Error("No token provided");
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new Error("Invalid token format");
    }

    
    const token = parts[1];
    // console.log("Token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded object from authMiddleware:", decoded);

    // console.log("Checking if user exists");
    const user = await User.findOne({ _id: decoded.id });
    // console.log("User object from authMiddleware:", user);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed my boy" });
  }
};

module.exports = authMiddleware;
