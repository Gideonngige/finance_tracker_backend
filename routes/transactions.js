const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const protect = require('../middleware/auth');

// @route POST /api/transactions
router.post('/', protect, async (req, res) => {
  const { title, amount, category, date } = req.body;
  try {
    const transaction = new Transaction({
      user: req.user._id,
      title,
      amount,
      category,
      date,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/transactions
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/transactions/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
