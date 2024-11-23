const passport = require("passport");
const User = require("../models/User");
const express = require("express");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: `${process.env.FRONTEND_URL}/homeNew`,
  })
);

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    successRedirect: "/dashboard",
  })
);

router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      isLoggedIn: true,
      user: req.user,
      message: "User is authenticated",
    });
  } else {
    res.status(401).json({
      isLoggedIn: false,
      message: "User is not authenticated",
    });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

router.get("/test", (req, res) => {
  res.send("Hello World");
});

module.exports = router;
