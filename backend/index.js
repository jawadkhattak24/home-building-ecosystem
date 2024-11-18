const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

const http = require("http");
const userRoutes = require("./routes/user");

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

app.use(cors());
app.use(express.json());
const server = http.createServer(app);

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Connected to Mango, sorry MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });




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

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


module.exports = app;
