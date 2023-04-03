const mongoose = require('mongoose');
require('dotenv').config();
const Joi = require('joi');

// Project Schema
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    minlength: 3,
    maxlength: 255,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: false,
  },
  skills: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Skill',
    required: false,
  },
});

const Project = mongoose.model('Project', projectSchema);

// Verify format
function validateProject(project: object) {
  const schema = {
    name: Joi.string().min(3).max(25).required(),
    description: Joi.string().min(3).max(255),
    owner: Joi.objectId().required(),
    members: Joi.array().items(Joi.objectId()),
    skills: Joi.array().items(Joi.objectId()),
  };

  return Joi.validate(project, schema);
}

exports.Project = Project;
exports.validate = validateProject;
