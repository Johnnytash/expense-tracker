const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture, sub } = ticket.getPayload();

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        googleId: sub,
        profilePicture: picture,
      });
    } else if (!user.googleId) {
      user.googleId = sub;
      user.profilePicture = picture;
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token: jwtToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

module.exports = router;
