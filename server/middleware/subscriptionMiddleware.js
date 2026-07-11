const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const subscriptionMiddleware = async (req, res, next) => {

  try {

    // السوبر أدمن يدخل دائمًا
    if (req.user.role === "SuperAdmin") {
      return next();
    }

    const store = await prisma.store.findUnique({

      where: {

        id: req.user.storeId,

      },

    });

    if (!store) {

      return res.status(404).json({

        message: "Store Not Found",

      });

    }

    if (!store.isActive) {

      return res.status(403).json({

        message: "Store Disabled",

      });

    }

    if (new Date() > new Date(store.subscriptionEnd)) {

      return res.status(403).json({

        message: "Subscription Expired",

      });

    }

    next();

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      message: "Server Error",

    });

  }

};

module.exports = subscriptionMiddleware;