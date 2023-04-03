const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
require('dotenv').config();
const Joi = require('joi');

// User Schema
const userSchema = new mongoose.Schema({
  lastname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
    trim: true,
  },
  firstname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  projects: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Project',
  },
  skills: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Skill',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// Generate JWT
userSchema.methods.generateAuthToken = function () {
  const user = _.pick(this, [
    'name',
    'email',
    'projects',
    'isAdmin',
    'createdAt',
  ]);
  const token = jwt.sign({ user: user }, process.env.jwtPrivateKey, {
    expiresIn: '3600s',
  });
  return token;
};

const User = mongoose.model('User', userSchema);

// Verify format
function validateUser(user: object) {
  const schema = {
    lastname: Joi.string().min(3).max(25).required(),
    firstname: Joi.string().min(3).max(25).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
    projects: Joi.array().items(Joi.objectId()),
    skills: Joi.array().items(Joi.objectId()),
    isAdmin: Joi.boolean(),
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
