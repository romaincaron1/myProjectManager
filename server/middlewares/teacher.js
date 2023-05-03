/**
 * Check if the user is an teacher
 */
module.exports = function (req, res, next) {
  console.log(req.user.user.role)
    if (req.user.user.role !== "teacher" && req.user.user.role !== "admin") return res.status(403).send("Access denied.");
    next();
  };
  