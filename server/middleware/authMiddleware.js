const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  try {

    // GET TOKEN

    const authHeader = req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({
        message: "Access Denied",
      });

    }

    // FORMAT:
    // Bearer TOKEN

    const token = authHeader.split(" ")[1];

    if (!token) {

      return res.status(401).json({
        message: "Invalid Token",
      });

    }

    // VERIFY TOKEN

    const verified = jwt.verify(
      token,
      "SECRET_KEY"
    );

    // SAVE USER DATA

    req.user = verified;

    next();

  } 
  catch(error){

if(error.name==="TokenExpiredError"){

return res.status(401).json({

message:"Token Expired"

});

}


return res.status(401).json({

message:"Invalid Token"

});


}

};

module.exports = authMiddleware;