const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
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
  },
  status: {
    type: String,
    enum: ['urgent','moderate','forLater']
  },
owner: {
  type: String,
  required: true
}
});

const Task = mongoose.model('Task', taskSchema);

taskSchema.methods.validateInput = function () {
  const schema = Joi.object().keys({
    nameTask: Joi.string()
    .min(3)
    .max(50)
    .required(),
    dateTask: Joi.date()
    .required(),
    description: Joi.string(),
    status: Joi.string()
  })
  .options({abortEarly : false});
  return schema.validate(this.toObject());
}

exports.taskSchema = taskSchema;
exports.Task = Task;