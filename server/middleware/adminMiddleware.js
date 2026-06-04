const adminMiddleware = (req, res, next) => {

  try {

    console.log("USER DATA:", req.user);
    console.log("ROLE:", req.user?.role);

    if (req.user.role !== "Admin") {

      return res.status(403).json({
        message: "Access Denied",
      });

    }

    next();

  } catch (error) {

    console.log("ADMIN MIDDLEWARE ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
    });

  }

};

module.exports = adminMiddleware;