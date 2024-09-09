const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      throw new Error("No Authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      throw new Error("No token provided");
    }

    console.log("Received token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // Check for both id and userId to handle potential old tokens
    const userId = decoded.id || decoded.userId;
    if (!userId) {
      throw new Error("Invalid token payload");
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    console.log("User found:", user.id);

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res
      .status(401)
      .json({ error: "Please authenticate", details: error.message });
  }
};
