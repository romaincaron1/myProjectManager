const mongoose = require("mongoose");
require("dotenv").config();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// Skill Schema
const skillSchema = new mongoose.Schema({
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
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

const Skill = mongoose.model("Skill", skillSchema);

// Verify format
function validateSkill(skill) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(25).required(),
    description: Joi.string().min(3).max(255),
    project: Joi.objectId().required(),
  });

  return schema.validate(skill);
}

exports.Skill = Skill;
exports.validate = validateSkill;
