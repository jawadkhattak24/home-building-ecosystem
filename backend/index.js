const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

const http = require("http");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

require("./config/passport");

console.log("mongodb url :", process.env.MONGODB_URI);

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 24 * 60 * 60 * 1000,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
const server = http.createServer(app);

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(
  session({
    secret: "homebuildingecosystem2024",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

app.use("/api/user", userRoutes);
app.use("/auth", authRoutes);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
