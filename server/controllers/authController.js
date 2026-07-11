const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


/* REGISTER */

const register = async (req, res) => {

  try {

  const{
name,
email,
password,
role,
storeName,
phone
}=req.body;

    // CHECK USER EXISTS

    const existingUser = await prisma.user.findUnique({

      where: {
        email,
      },

    });

    if (existingUser) {

      return res.status(400).json({
        message: "User already exists",
      });

    }

    // HASH PASSWORD

    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER

    let store = await prisma.store.findFirst();


if(!store){

store = await prisma.store.create({

data:{

name:"بدلتك",

subscriptionEnd:new Date(

Date.now()+365*24*60*60*1000

)

}

});

}
const Store = await prisma.store.create({

data:{

name:storeName,

phone,

subscriptionEnd:new Date(

Date.now()+30*24*60*60*1000

)

}

});


const user = await prisma.user.create({

data:{

name,

email,

password:hashedPassword,

role: role || "Admin",

storeId: Store.id

},

});

    // GENERATE TOKEN

    const token = jwt.sign(

{

userId: user.id,
role: user.role,
storeId: user.storeId

},

"SECRET_KEY",

{
expiresIn:"7d"
}

);
console.log("===== LOGIN USER =====");
console.log(user);
console.log("TOKEN PAYLOAD:", {
  userId: user.id,
  role: user.role,
  storeId: user.storeId
});
    res.status(201).json({

      message: "User Registered Successfully",

      token,

      user: {

        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,

      },

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


/* LOGIN */

const login = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // CHECK USER

 const user = await prisma.user.findUnique({

  where: {
    email,
  },

  include: {
    store: true,
  },

});

    if (!user) {

      return res.status(400).json({
        message: "Invalid Email or Password",
      });

    }

    // CHECK PASSWORD

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {

      return res.status(400).json({
        message: "Invalid Email or Password",
      });

    }

    // GENERATE TOKEN

    const token = jwt.sign(

{

userId:user.id,
role:user.role,
storeId:user.storeId

},

"SECRET_KEY",

{
expiresIn:"7d"
}

);

    res.json({

      message: "Login Successful",

      token,

      user: {

  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,

  storeId: user.storeId,

  store: user.store,

}

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


module.exports = {
  register,
  login,
};