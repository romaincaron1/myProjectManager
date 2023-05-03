const express = require("express");
const { Project, validate } = require("../models/project");
const _ = require("lodash");
const auth = require("../middlewares/auth");
const teacher = require("../middlewares/teacher");
const router = express.Router();

// GET projects
router.get("/", auth, async (_, res) => {
    const projects = await Project.find();
    res.send(projects);
});

// GET project
router.get("/:id", auth, async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send("Project not found");
    res.send(project);
});

// POST project
router.post("/", auth, teacher, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let project = await Project.findOne({ name: req.body.name });
    if (project) return res.status(400).send("Project already exists");

    project = new Project(_.pick(req.body, ["name", "description", "owner", "skills"]));
    await project.save();

    res.send(_.pick(project, ["_id", "name", "description", "owner", "skills"]));
});

// PUT project
router.put("/:id", auth, teacher, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const project = await Project.findByIdAndUpdate(
        req.params.id,
        _.pick(req.body, ["name", "description", "owner", "skills"]),
        { new: true }
    );
    if (!project) return res.status(400).send("Project not found");

    res.send(project);
});

// DELETE project
router.delete("/:id", auth, teacher, async (req, res) => {
    const project = await Project.findByIdAndRemove(req.params.id);
    if (!project) return res.status(400).send("Project not found");
    res.send(project);
});

// PATCH project
router.patch("/:id", auth, teacher, async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(400).send("Project not found");

    if (req.body.name) project.name = req.body.name;
    if (req.body.skills) project.skills = req.body.skills;

    await project.save();
    res.send(project);
});

module.exports = router;