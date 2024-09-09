const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      token,
      user: { id: user.id, email: user.email, fullName: user.fullName },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const isValid = await user.validPassword(req.body.password);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      token,
      user: { id: user.id, email: user.email, fullName: user.fullName },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
