/**
 * Check if the user is an admin
 */
module.exports = function (req, res, next) {
  if (req.user.user.role !== "admin") return res.status(403).send("Access denied.");
  next();
};
