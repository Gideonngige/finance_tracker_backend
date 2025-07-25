const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks
router.get('/get_tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST add task
router.post('/add_task', async (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }

  try {
    const newTask = new Task({ task });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// DELETE remove task
router.delete('/remove_task', async (req, res) => {
  const taskId = req.query.id;
  if (!taskId) {
    return res.status(400).json({ error: 'Task ID is required' });
  }

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
