const express = require("express");
const router = express.Router();
const User = require("../models/User");


router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
});




module.exports = router;
