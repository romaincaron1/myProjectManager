const express = require("express");
const { Skill, validate } = require("../models/skill");
const { Project } = require("../models/project");
const _ = require("lodash");
const auth = require("../middlewares/auth");
const teacher = require("../middlewares/teacher");
const router = express.Router();

// GET skills
router.get("/", auth, async (_, res) => {
  const skills = await Skill.find();
  res.send(skills);
});

// GET skill
router.get("/:id", auth, async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) return res.status(404).send("Skill not found");
  res.send(skill);
});

// POST skill
router.post("/", auth, teacher, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let skill = await Skill.findOne({ name: req.body.name });
  if (skill) return res.status(400).send("Skill already exists");

  let project = await Project.findOne({ _id: req.body.project });
  if (!project) return res.status(400).send("Project not found");

  skill = new Skill(_.pick(req.body, ["name", "project", "description"]));
  await skill.save();

  let skills = project.skills;
  skills.push(skill._id);
  project.skills = skills;
  await project.save();

  res.send(_.pick(skill, ["_id", "name", "project", "description"]));
});

// PUT skill
router.put("/:id", auth, teacher, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let skill = await Skill.findById(req.params.id);
  if (!skill) return res.status(404).send("Skill not found");

  let project = await Project.findOne({ _id: req.body.project });
  if (!project) return res.status(400).send("Project not found");

  // If the project has changed, remove the skill from the former project
  if (skill.project != req.body.project) {
    let formerProject = await Project.findOne({ _id: skill.project });
    formerProject.skills.forEach((skill, index) => {
      if (skill == req.params.id) {
        formerProject.skills.splice(index, 1);
      }
    });
    await formerProject.save();
  }

  // Update the skill
  skill.name = req.body.name;
  skill.project = req.body.project;
  skill.description = req.body.description;
  await skill.save();

  // Update the project with the new skill
  let skills = project.skills;
  if (!skills.find((skill) => skill == skill._id)) {
    skills.push(skill._id);
    project.skills = skills;
    await project.save();
  }

  res.send(_.pick(skill, ["_id", "name", "project", "description"]));
});

// DELETE skill
router.delete("/:id", auth, teacher, async (req, res) => {
  const skill = await Skill.findByIdAndRemove(req.params.id);
  if (!skill) return res.status(400).send("Skill not found");

  const project = await Project.findOne({ _id: skill.project });
  if (!project) return res.status(400).send("Project not found");

  // Remove the skill from the project
  project.skills.forEach((skill, index) => {
    if (skill == req.params.id) {
      project.skills.splice(index, 1);
    }
  });
  await project.save();

  res.send(skill);
});

// PATCH skill
router.patch("/:id", auth, teacher, async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) return res.status(400).send("Skill not found");

  let project = await Project.findOne({ _id: req.body.project });
  if (!project) return res.status(400).send("Project not found");

  if (req.body.name) skill.name = req.body.name;
  if (req.body.description) skill.description = req.body.description;
  if (req.body.project) {
    // If the project has changed, remove the skill from the former project
    if (skill.project != req.body.project) {
      let formerProject = await Project.findOne({ _id: skill.project });
      formerProject.skills.forEach((skill, index) => {
        if (skill == req.params.id) {
          formerProject.skills.splice(index, 1);
        }
      });
      await formerProject.save();
    }

    // Update the skill
    skill.project = req.body.project;
    await skill.save();

    // Update the project with the new skill
    let skills = project.skills;
    if (!skills.find((skill) => skill == skill._id)) {
      skills.push(skill._id);
      project.skills = skills;
      await project.save();
    }
  }

  res.send(skill);
});

module.exports = router;
