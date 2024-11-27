const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
const passport = require("passport");
const jwt = require("jsonwebtoken");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        const username = profile.emails[0].value.split("@")[0];

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            username: username,
            email: profile.emails[0].value,
            isVerified: true,
            profilePictureUrl: profile.photos[0].value,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ facebookId: profile.id });

        if (user) {
          return done(null, user);
        }

        const username = profile.emails
          ? profile.emails[0].value.split("@")[0]
          : profile.displayName.replace(/\s/g, "").toLowerCase();

        user = await User.create({
          facebookId: profile.id,
          name: profile.displayName,
          username: username,
          email: profile.emails
            ? profile.emails[0].value
            : `${profile.id}@facebook.com`,
          isVerified: true,
          profilePictureUrl: profile.photos ? profile.photos[0].value : null,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
