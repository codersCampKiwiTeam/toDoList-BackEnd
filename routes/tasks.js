const {Task} = require('../models/task'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const config = require('config');

router.get('/', require('../middleware/auth.js').isAuthenticated, cors(), async (req, res) => {
  const token = req.header('X-Auth-Token');
  const decoded = jwt.verify(token, 'kiwi-secret');
  const id = decoded._id;
  //
  // const token = usertoken.split(' ');
  // const decoded = jwt.verify(token[1], 'secret-key');
  console.log(decoded);
  console.log(id);
  // const tasks = await Task.find().sort('nameTask');
  const tasks = await Task.find({id});
  console.log(req.user._id);
  console.log(tasks);
  res.send(tasks);
});

//Problemy z joi

router.post('/', require('../middleware/auth.js').isAuthenticated, cors(), async (req, res) => {
//   try {
//       let task = new Task({ 
//         nameTask: req.body.nameTask,
//         dateTask: req.body.dateTask,
//         description: req.body.description,
//         status: req.body.list
//       });

//       let validationResult = task.validateInput();
//       if (validationResult.error !== undefined) {
//         return res.status(400).send(validationResult.error.details.map(i => i.message).join("\r\n"));
//       }

//       let result = await task.save();
//       return res.send(task);
//     }
//     catch(ex) {
//       return res.status(404).send('There was an error while processing the request');
//     }
// });
  // const validationResult = task.validateInput();
  // if (validationResult.error !== undefined) {
  //   return res.status(400).send(validationResult.error.details.map(i => i.message).join("\r\n"));
  // }
  console.log(req.body);
  try {
    let task = new Task({ 
      nameTask: req.body.nameTask,
      dateTask: req.body.dateTask,
      description: req.body.description,
      status: req.body.status,
      owner: req.body.owner
    });
    task = await task.save();
    console.log(task);
    res.send(task);
  }
  catch(error) {
    return res.send(`Error: ${error}. Request: ${req}`)
  }
  
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