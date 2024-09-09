require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log("Incoming request:", {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body,
  });
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;

db.sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Unable to sync database:", error);
  });
