const superAdminMiddleware = (req, res, next) => {

  if (req.user.role !== "SuperAdmin") {

    return res.status(403).json({
      message: "Access Denied"
    });

  }

  next();

};

module.exports = superAdminMiddleware;