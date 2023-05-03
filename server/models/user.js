const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
require("dotenv").config();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

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
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
  },
  projects: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Project",
  },
  skills: {
    type: Array,
    items: {
      type: Object,
      required: false,
      properties: {
        skill: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill",
          required: true,
        },
        state: {
          type: String,
          enum: ["not_acquired", "in_progress", "acquired"],
          required: true,
        },
      },
    },
  },
});

// Generate JWT
userSchema.methods.generateAuthToken = function () {
  const user = _.pick(this, [
    "_id",
    "firstname",
    "lastname",
    "email",
    "role",
    "createdAt",
  ]);
  const token = jwt.sign({ user: user }, process.env.jwtPrivateKey, {
    expiresIn: "7200s",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

// Verify format
function validateUser(user) {
  const skillSchema = Joi.object({
    skill: Joi.objectId().required(),
    state: Joi.string().valid('not_acquired', 'in_progress', 'acquired').required()
  });

  const schema = Joi.object({
    lastname: Joi.string().min(3).max(25).required(),
    firstname: Joi.string().min(3).max(25).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    role: Joi.string().valid("student", "teacher", "admin").required(),
    projects: Joi.array().items(Joi.objectId()),
    skills: Joi.array().items(skillSchema)
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
