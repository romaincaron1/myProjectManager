const mongoose = require("mongoose");
require("dotenv").config();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

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
    ref: "User",
    required: true,
  },
  skills: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Skill",
    required: false,
  },
});

const Project = mongoose.model("Project", projectSchema);

// Verify format
function validateProject(project) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(25).required(),
    description: Joi.string().min(3).max(255),
    owner: Joi.objectId().required(),
    skills: Joi.array().items(Joi.objectId()),
  });

  return schema.validate(project);
}

exports.Project = Project;
exports.validate = validateProject;
