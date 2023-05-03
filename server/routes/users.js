const express = require("express");
const { User, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const router = express.Router();

// Me
router.get("/me", auth, async (req, res) => {
	console.log(req.user)
	const user = await User.findById(req.user._id).select("-password");
	if (!user) return res.status(404).send("User not found");
	res.send(user);
});

// GET users
router.get("/", auth, admin, async (_, res) => {
	const users = await User.find();
	res.send(users);
});

// GET user
router.get("/:id", auth, admin, async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) return res.status(404).send("User not found");
	res.send(user);
});

// POST user
router.post("/", auth, admin, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });
	if (user) return res.status(400).send("User already registered");

	user = new User(_.pick(req.body, ["firstname", "lastname", "email", "password", "role"]));
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
	await user.save();

	res.send(_.pick(user, ["_id", "firstname", "lastname", "email", "role"]));
});

// PUT user
router.put("/:id", auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findByIdAndUpdate(
		req.params.id,
		_.pick(req.body, ["firstname", "lastname", "email", "password", "projects", "skills"]),
		{ new: true }
	);
	if (!user) return res.status(400).send("User not found");

	res.send(user);
});

// DELETE user
router.delete("/:id", auth, admin, async (req, res) => {
	const user = await User.findByIdAndRemove(req.params.id);
	if (!user) return res.status(404).send("User not found");
	res.send(user);
});

// PATCH user
router.patch("/:id", auth, async (req, res) => {
	if (req.body.email) {
		let user = await User.findOne({ email: req.body.email });
		if (user) return res.status(409).send("User already exists");
	}
	const user = await User.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true }
	);
	if (!user) return res.status(404).send("User not found");
	res.send(user);
});

// PATCH current user
router.patch("/", auth, async (req, res) => {
	if (req.body.email) {
		let user = await User.findOne({ email: req.body.email });
		if (user) return res.status(409).send("User already exists");
	}
	const user = await User.findOneAndUpdate(	
		{ email: req.user.user.email },
		req.body,
		{ new: true }
	);
	if (!user) return res.status(404).send("User not found");
	const newToken = user.generateAuthToken();

	res.send(newToken);
});

module.exports = router;