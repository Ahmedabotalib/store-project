module.exports = (req, res, next) => {

  if (
    req.user.role === "Admin" ||
    req.user.role === "Manager"
  ) {

    return next();

  }

  return res.status(403).json({
    message: "Access Denied",
  });

};