const passport = require("passport");
const User = require("../models/User");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { googleId: user.googleId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl,
      },
      token: token,
    });
  }
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
