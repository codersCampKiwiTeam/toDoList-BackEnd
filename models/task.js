const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const Task = mongoose.model('Task', new mongoose.Schema({
  nameTask: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  dateTask: {
      type: Date,
      required: true,
  },
  description: {
      type: String,
  }
}));

function validateTask(task) {
  const schema = {
    nameTask: Joi.string().min(3).max(50).required(),
    dateTask: Joi.date().required(),
    description: Joi.string()
  };

  return Joi.validate(task, schema);
}

exports.Task = Task; 
exports.validate = validateTask;