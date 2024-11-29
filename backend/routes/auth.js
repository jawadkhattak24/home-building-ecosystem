const passport = require("passport");
const User = require("../models/User");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

router.get("/google", (req, res, next) => {
  const { userType } = req.query;
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: userType,
  })(req, res, next);
});

router.get("/google/login", (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      {
        id: user._id,
        userType: user.userType,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

router.get(
  "/google/login/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

router.get("/facebook", (req, res, next) => {
  const { userType } = req.query;
  passport.authenticate("facebook", {
    scope: ["email"],
    state: userType,
  })(req, res, next);
});

router.get("/facebook/login", (req, res, next) => {
  passport.authenticate("facebook", {
    scope: ["email"],
  })(req, res, next);
});

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

router.get(
  "/facebook/login/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.redirect(
      `${process.env.FRONTEND_URL}/auth.facebook/login/success?token=${token}`
    );
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
