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

const defaultAvatar =
  "https://servicesthumbnailbucket.s3.ap-south-1.amazonaws.com/profile_avatar.jpg";
const defaultCover =
  "https://servicesthumbnailbucket.s3.ap-south-1.amazonaws.com/defaultCover.png";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
    const userType = req.query.state;

      console.log("Profile ID:", profile.id);
      console.log("Full Profile:", JSON.stringify(profile, null, 2));

      try {
        let user = await User.findOne({ googleId: profile.id }).exec();

        console.log("Search query:", { googleId: profile.id });
        console.log("Initial user search result:", user);

        if (user) {
          console.log("Existing user found, updating last login");
          user = await User.findOneAndUpdate(
            { googleId: profile.id },
            { lastLogin: new Date() },
            { new: true }
          ).exec();

          console.log("Updated user:", user);
          return done(null, user);
        }

        console.log("No user found, creating new user");
        const username = profile.emails[0].value.split("@")[0];

        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          username: username,
          email: profile.emails[0].value,
          isVerified: true,
          profilePictureUrl: profile.photos[0]?.value || defaultAvatar,
          coverPictureUrl: defaultCover,
          lastLogin: new Date(),
          provider: "google",
        };

        console.log("Creating new user with data:", newUser);

        user = await User.create(newUser);
        console.log("New user created:", user);

        return done(null, user);
      } catch (err) {
        console.error("Error in Google Strategy:", err);
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
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ facebookId: profile.id });

        if (user) {
          user = await User.findOneAndUpdate(
            { facebookId: profile.id },
            { lastLogin: new Date() },
            { new: true }
          );
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
          profilePictureUrl: profile.photos
            ? profile.photos[0].value
            : defaultAvatar,
          coverPictureUrl: defaultCover,
          lastLogin: new Date(),
          provider: "facebook",
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.transformUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    username: user.username,
    userType: user.userType,
    profilePictureUrl: user.profilePictureUrl,
    coverPictureUrl: user.coverPictureUrl,
    isVerified: user.isVerified,
    provider: user.provider,
  };
};

module.exports = passport;
