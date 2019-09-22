const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 500
	},
	date: {
		type: Date,
		required: false,
	},
	status: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	solved: {
		type: Boolean,
		required: true,
		default: false,
	}
});

taskSchema.methods.validateInput = function () {
    const schema = Joi.object().keys({
        _id: Joi.any(),
		userId: Joi.string().required(),
        name: Joi.string().min(3).max(500).required(),
        date: Joi.date(),
		status: Joi.string().required(),
        description: Joi.string(),
		solved: Joi.boolean().required()
    }).options({abortEarly : false});

    return schema.validate(this.toObject());
}

const Task = mongoose.model('Task', taskSchema);

exports.Task = Task; 
