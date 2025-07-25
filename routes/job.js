const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const protect = require('../middleware/auth');

// POST /api/jobs - post a job
router.post('/', protect, async (req, res) => {
  const { title, description, category, budget } = req.body;
  try {
    const job = new Job({
      title,
      description,
      category,
      budget,
      postedBy: req.user.id,
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET /api/jobs - fetch all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email');
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
