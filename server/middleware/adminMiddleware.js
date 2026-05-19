const adminMiddleware = (req, res, next) => {

  try {

    if (req.user.role !== "Admin") {

      return res.status(403).json({
        message: "Access Denied",
      });

    }

    next();

  } catch (error) {

    return res.status(500).json({
      message: "Server Error",
    });

  }

};

module.exports = adminMiddleware;