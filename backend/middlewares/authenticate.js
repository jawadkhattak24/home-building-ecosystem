const express = require("express");
const authenticate = require("../middleware/authenticate");
const router = express.Router();
const User = require("../models/User");

router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
