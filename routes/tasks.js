const Task = require('../models/task'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const tasks = await Task.find().sort('nameTask');
  res.send(tasks);
});

router.post('/', require('../middleware/auth.js').isAuthenticated, async (req, res) => {
  const validationResult = task.validateInput();
  if (validationResult.error !== undefined) {
    return res.status(400).send(validationResult.error.details.map(i => i.message).join("\r\n"));
  }

  let task = new Task({ 
    nameTask: req.body.nameTask,
    dateTask: req.body.dateTask,
    description: req.body.description,
    status: req.body.list
  });
  task = await task.save();
  
  res.send(task);
});

router.put('/:id', require('../middleware/auth.js').isAuthenticated, async (req, res) => {
  const validationResult = task.validateInput();
  if (validationResult.error !== undefined) {
    return res.status(400).send(validationResult.error.details.map(i => i.message).join("\r\n"));
  }

  const task = await Task.findByIdAndUpdate(req.params.id,
    {
        nameTask: req.body.nameTask,
        dateTask: req.body.dateTask,
        description: req.body.description,
        status: req.body.status
    }, { new: true });

  if (!task) return res.status(404).send('The task with the given ID was not found.');
  
  res.send(task);
});

router.delete('/:id', require('../middleware/auth.js').isAuthenticated, async (req, res) => {
  const task = await Task.findByIdAndRemove(req.params.id);

  if (!task) return res.status(404).send('The task with the given ID was not found.');

  res.send(task);
});

router.get('/:id', require('../middleware/auth.js').isAuthenticated, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).send('The task with the given ID was not found.');

  res.send(task);
});

module.exports = router; 