const express = require("express");
const { Transaction } = require("../models");
const auth = require("../middleware/auth");
const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { UserId: req.user.id },
    });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("Received transaction data:", req.body);
    console.log("User ID from auth middleware:", req.user.id);

    const { name, amount, date, type, tag } = req.body;
    const transaction = await Transaction.create({
      name,
      amount,
      date,
      type,
      tag,
      UserId: req.user.id,
    });

    console.log("Created transaction:", transaction);
    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, date, type, tag } = req.body;
    const transaction = await Transaction.findOne({
      where: { id, UserId: req.user.id },
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    await transaction.update({ name, amount, date, type, tag });
    res.json(transaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({
      where: { id, UserId: req.user.id },
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    await transaction.destroy();
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
