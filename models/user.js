const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  }
});

userSchema.methods.validateInput = function() {
    const schema = Joi.object().keys({
      _id: Joi.any(),
      name: Joi.string()
        .alphanum()
        .min(5)
        .max(50)
        .required(),
      password: Joi.string()
        .pattern(/^[a-zA-Z0-9!@#$&()\\-`.+,/\"]*$/)
        .min(5)
        .max(1024)
        .required(),
      email: Joi.string()
        .email()
        .required()
    })
    .options({abortEarly : false});
    return schema.validate(this.toObject());
}

userSchema.methods.hashPassword = async function() {
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};

userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id}, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('User', userSchema);

exports.User = User; 
