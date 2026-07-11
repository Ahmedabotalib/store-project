const adminMiddleware = require("./middleware/adminMiddleware");
const authMiddleware = require("./middleware/authMiddleware");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const bcrypt = require("bcryptjs");
const upload = require("./middleware/uploadMiddleware");
const path = require("path");
const managerMiddleware = require("./middleware/managerMiddleware");
const jwt = require("jsonwebtoken");
const superAdminMiddleware =require("./middleware/superAdminMiddleware");
const subscriptionMiddleware = require("./middleware/subscriptionMiddleware");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/auth", authRoutes);


/* HOME ROUTE */

app.get("/", (req, res) => {

  res.json({
    message: "Server Running Successfully",
  });

});

/* GET PRODUCTS */

app.get(
  "/products",
  authMiddleware,
  subscriptionMiddleware,
  async (req, res) => {

    try {
console.log("===== PRODUCTS REQUEST =====");
console.log(req.user);
      const products = await prisma.product.findMany({

where:{

storeId:req.user.storeId

},

orderBy:{
createdAt:"desc"
}

});

      res.json(products);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);

/* ADD PRODUCT */

app.post(
  "/products",
  authMiddleware,
  managerMiddleware,
  subscriptionMiddleware,
  upload.single("image"),
  async (req, res) => {
console.log("REQ.USER =", req.user);
    try {

const {
  name,
  category,
  size,
  color,

  salePrice,
  rentalPrice,

  canSell,
  canRent,

  type,

  stock,
  status,

} = req.body;
console.log(req.body);
console.log("TYPE =", type);

      const image = req.file
        ? req.file.filename
        : null;

      const newProduct = await prisma.product.create({

data:{

name,

category,

size,

color,

image,

salePrice:
salePrice
? Number(salePrice)
: null,


rentalPrice:
rentalPrice
? Number(rentalPrice)
: null,


type,

storeId:req.user.storeId,

stock:Number(stock),

status,

}

});

      

      res.status(201).json({

        message: "Product Added Successfully",

        product: newProduct,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);





/* DELETE PRODUCT */

app.delete(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  subscriptionMiddleware,
  async (req, res) => {

    try {

      const { id } = req.params;

      await prisma.product.delete({
        where: {
          id: Number(id),
        },
      });

      res.json({
        message: "Product Deleted Successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);
app.get("/products/:id",
   subscriptionMiddleware,
   async (req, res) => {

  try {

    const product = await prisma.product.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!product) {

      return res.status(404).json({
        message: "Product Not Found",
      });

    }

    res.json(product);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

});
/* UPDATE PRODUCT */
app.put(
  "/products/:id",
  authMiddleware,
  managerMiddleware,
  subscriptionMiddleware,
  upload.single("image"),
  async (req, res) => {

    try {

  const {

name,
category,
size,
color,

salePrice,
rentalPrice,

type,

stock,
status

}=req.body;

      const oldProduct =
        await prisma.product.findUnique({

          where: {
            id: Number(req.params.id),
          },

        });

      const image = req.file
        ? req.file.filename
        : oldProduct.image;

      const updatedProduct =
        await prisma.product.update({

          where: {
            id: Number(req.params.id),
          },

          data:{

name,

category,

size,

color,

image,


salePrice:
salePrice
? Number(salePrice)
: null,


rentalPrice:
rentalPrice
? Number(rentalPrice)
: null,


canSell:
canSell === "true",


canRent:
canRent === "true",


type,


stock:
Number(stock),

status,

},

        });

      res.json({

        message: "Product Updated Successfully",

        product: updatedProduct,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);
app.get(
  "/dashboard/stats",
  authMiddleware,
  subscriptionMiddleware,
  async (req, res) => {
    try {
const month =
  Number(req.query.month);

const year =
  Number(req.query.year);

const startDate =
  new Date(year, month - 1, 1);

const endDate =
  new Date(year, month, 1);
      const totalProducts =
await prisma.product.count({

where:{
storeId:req.user.storeId
}

});

      const availableProducts =
await prisma.product.count({

where:{

storeId:req.user.storeId,

status:"Available"

}

});;

      const rentedProducts =
await prisma.product.count({

where:{

storeId:req.user.storeId,

status:"Rented"

}

});

      const totalUsers = await prisma.user.count({

  where: {

    storeId: req.user.storeId,

  },

});

      const totalCustomers =
await prisma.customer.count({

where:{
storeId:req.user.storeId
}

});

      const activeRentals =
await prisma.rental.count({

where:{

storeId:req.user.storeId,

status:"Active"

}

});

  const revenue =
await prisma.rental.aggregate({

 _sum:{
   totalPrice:true
 },

 where:{

   storeId:req.user.storeId

 }

});
 

const startOfMonth =
  new Date(year, month - 1, 1);

const endOfMonth =
  new Date(year, month, 1);

const startOfYear =
  new Date(year, 0, 1);

const endOfYear =
  new Date(year + 1, 0, 1);

const monthlyRevenue =
await prisma.rental.aggregate({

 _sum:{
   totalPrice:true
 },

 where:{

   storeId:req.user.storeId,

   startDate:{
      gte:startOfMonth,
      lt:endOfMonth
   }

 }

});

const yearlyRevenue =
await prisma.rental.aggregate({

 _sum:{
   totalPrice:true
 },

 where:{

   storeId:req.user.storeId,

   startDate:{
      gte:startOfYear,
      lt:endOfYear
   }

 }

});
const salesRevenue =
await prisma.sale.aggregate({

 _sum:{
   totalPrice:true
 },

 where:{

   storeId:req.user.storeId

 }

});
const monthlySalesRevenue =
await prisma.sale.aggregate({

 _sum:{
   totalPrice:true
 },

 where:{

   storeId:req.user.storeId,

   soldAt:{
      gte:startOfMonth,
      lt:endOfMonth
   }

 }

});
const yearlySalesRevenue =
await prisma.sale.aggregate({

 _sum:{
   totalPrice:true
 },

 where:{

   storeId:req.user.storeId,

   soldAt:{
      gte:startOfYear,
      lt:endOfYear
   }

 }

});
const totalRevenue =

(revenue._sum.totalPrice || 0)

+

(salesRevenue._sum.totalPrice || 0);
const totalMonthlyRevenue =


(monthlyRevenue._sum.totalPrice ||0)

+

(monthlySalesRevenue._sum.totalPrice ||0);
const totalYearlyRevenue =


(yearlyRevenue._sum.totalPrice ||0)

+

(yearlySalesRevenue._sum.totalPrice ||0);
     
const totalSales =
await prisma.sale.count({

where:{
storeId:req.user.storeId
}

});



const monthlySales =
await prisma.sale.count({

where:{

storeId:req.user.storeId,

soldAt:{
gte:startOfMonth,
lt:endOfMonth
}

}

});




const yearlySales =
await prisma.sale.count({

where:{

storeId:req.user.storeId,

soldAt:{
gte:startOfYear,
lt:endOfYear
}

}

});
console.log("Dashboard Data");

console.log({

rentalRevenue:
revenue._sum.totalPrice,

salesRevenue:
salesRevenue._sum.totalPrice,

monthlyRental:
monthlyRevenue._sum.totalPrice,

yearlyRental:
yearlyRevenue._sum.totalPrice,

monthlySales:
monthlySalesRevenue._sum.totalPrice,

yearlySales:
yearlySalesRevenue._sum.totalPrice,

totalRevenue,

totalMonthlyRevenue,

totalYearlyRevenue

});

      res.json({
        totalProducts,
        availableProducts,
        rentedProducts,
        totalUsers,
        totalCustomers,
        activeRentals,
        rentalRevenue:
revenue._sum.totalPrice ||0,


salesRevenue:
salesRevenue._sum.totalPrice ||0,


revenue:
totalRevenue,


monthlyRevenue:
totalMonthlyRevenue,


yearlyRevenue:
totalYearlyRevenue,


totalSales,

monthlySales,

yearlySales,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }
  }
);
/* GET CUSTOMERS */

app.get(
  "/customers",
  authMiddleware,
  subscriptionMiddleware,
  async (req, res) => {

    try {

      const customers =
await prisma.customer.findMany({

where:{
storeId:req.user.storeId
},

orderBy:{
createdAt:"desc"
}

});

      res.json(customers);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);

/* ADD CUSTOMER */

app.post(
  "/customers",
  authMiddleware,
  subscriptionMiddleware,
  async (req, res) => {
console.log("REQ.USER =", req.user);
    try {

      const {
        name,
        phone,
        address,
      } = req.body;

      const customer =
await prisma.customer.create({

data:{

name,

phone,

address,

storeId:req.user.storeId

}

});

      res.status(201).json({

        message:
          "Customer Added Successfully",

        customer,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);
app.get("/customers/:id",
  subscriptionMiddleware,
   async (req, res) => {

  try {

    const customer = await prisma.customer.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer Not Found",
      });
    }

    res.json(customer);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

});
/* UPDATE CUSTOMER */
app.put(
  "/customers/:id",
  authMiddleware,
  subscriptionMiddleware,
  async (req, res) => {

    try {

      const {
        name,
        phone,
        address,
      } = req.body;

      const updatedCustomer =
        await prisma.customer.update({

          where: {
            id: Number(req.params.id),
          },

          data: {
            name,
            phone,
            address,
          },

        });

      res.json({

        message: "Customer Updated Successfully",

        customer: updatedCustomer,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);
/* DELETE CUSTOMER */
app.delete(
  "/customers/:id",
  authMiddleware,
  subscriptionMiddleware,
  async (req, res) => {

    try {

      await prisma.customer.delete({

        where: {
          id: Number(req.params.id),
        },

      });

      res.json({
        message: "Customer Deleted Successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);
app.get(
"/customers/:id/details",
subscriptionMiddleware,
authMiddleware,

async(req,res)=>{

try{


const customer = await prisma.customer.findUnique({

where:{
id:Number(req.params.id)
},

include:{

rentals:{

include:{
product:true
}

}

}

});



if(!customer){

return res.status(404).json({

message:"Customer Not Found"

});

}



const totalPaid = customer.rentals.reduce(

(total,rental)=>

total+rental.totalPrice,

0

);



res.json({

customer,

totalPaid

});



}


catch(error){


console.log(error);


res.status(500).json({

message:"Server Error"

});


}



}


);

/* GET SINGLE CUSTOMER */
app.get("/customers/:id", subscriptionMiddleware,
  async (req, res) => {

  try {

    const customer =
      await prisma.customer.findUnique({

        where: {
          id: Number(req.params.id),
        },

      });

    if (!customer) {

      return res.status(404).json({
        message: "Customer Not Found",
      });

    }

    res.json(customer);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

});
app.put(
  "/customers/:id",
  authMiddleware,
  subscriptionMiddleware,
  async (req, res) => {

    try {

      const {
        name,
        phone,
        address,
      } = req.body;

      const customer =
        await prisma.customer.update({

          where: {
            id: Number(req.params.id),
          },

          data: {
            name,
            phone,
            address,
          },

        });

      res.json({

        message: "Customer Updated Successfully",

        customer,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);
/* GET RENTALS */
app.get(
  "/rentals",
  authMiddleware,
  subscriptionMiddleware,
  async (req, res) => {
    try {

      const rentals = await prisma.rental.findMany({
        where: {
          storeId: req.user.storeId,
        },
        include: {
          customer: true,
          product: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.json(rentals);

    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

app.post(
  "/rentals",
  authMiddleware,
  subscriptionMiddleware,
  async (req, res) => {
console.log("REQ.USER =", req.user);
    try {

      const {
        customerId,
        productId,
        startDate,
        endDate,
        totalPrice,
      } = req.body;

      const rental =
await prisma.rental.create({

data: {

  customerId: Number(customerId),

  productId: Number(productId),

  startDate: new Date(startDate),

  endDate: new Date(endDate),

  totalPrice: Number(totalPrice),

  status: "Active",
  storeId:req.user.storeId,

},

});

const product =
await prisma.product.findUnique({

where: {
  id: Number(productId),
},

});

await prisma.product.update({

where: {
id: Number(productId),
},

data: {

stock: product.stock - 1,

status:
  product.stock - 1 <= 0
    ? "Rented"
    : "Available",

},

});

      res.status(201).json({

        message: "Rental Created Successfully",

        rental,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);

/* RETURN RENTAL */
app.put(
  "/rentals/return/:id",
  authMiddleware,
  subscriptionMiddleware,
  async (req, res) => {

    try {

      const rental =
        await prisma.rental.findUnique({

          where: {
            id: Number(req.params.id),
          },

        });

      if (!rental) {

        return res.status(404).json({
          message: "Rental Not Found",
        });

      }

      await prisma.rental.update({

        where: {
          id: rental.id,
        },

        data: {
          status: "Returned",
        },

      });

      const product = await prisma.product.findUnique({
  where: {
    id: rental.productId,
  },
});

await prisma.product.update({
  where: {
    id: rental.productId,
  },
  data: {
    stock: product.stock + 1,
    status: "Available",
  },
});

      res.json({
        message: "Rental Returned Successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);

/* GET RECENT RENTALS */
app.get(
  "/dashboard/recent-rentals",
  authMiddleware,
  subscriptionMiddleware,
  async (req, res) => {

    try {

 const rentals =
await prisma.rental.findMany({

where:{
storeId:req.user.storeId
},

take:5,

orderBy:{
createdAt:"desc"
},

include:{
customer:true,
product:true
}

});

      res.json(rentals);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);
/* GET USERS */
app.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  subscriptionMiddleware,
  async (req, res) => {

    try {

      const users = await prisma.user.findMany({

        where: {
          storeId: req.user.storeId,
        },

        orderBy: {
          createdAt: "desc",
        },

      });

      res.json(users);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);
app.get(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  subscriptionMiddleware,
  async (req, res) => {

    try {

     const user = await prisma.user.findFirst({

  where: {

    id: Number(req.params.id),

    storeId: req.user.storeId,

  },

});

      if (!user) {

        return res.status(404).json({
          message: "User Not Found",
        });

      }

      res.json(user);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);
app.put(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  subscriptionMiddleware,
  async (req, res) => {

    try {

      const {
        name,
        email,
        role,
      } = req.body;

  const oldUser = await prisma.user.findFirst({

  where: {

    id: Number(req.params.id),

    storeId: req.user.storeId,

  },

});

if (!oldUser) {

  return res.status(404).json({

    message: "User Not Found",

  });

}

const updatedUser = await prisma.user.update({

  where: {

    id: oldUser.id,

  },

  data: {

    name,

    email,

    role,

  },

});;

      res.json({

        message:
          "User Updated Successfully",

        user: updatedUser,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);
app.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  subscriptionMiddleware,
  async (req, res) => {

    try {

     const oldUser = await prisma.user.findFirst({

  where: {

    id: Number(req.params.id),

    storeId: req.user.storeId,

  },

});

if (!oldUser) {

  return res.status(404).json({

    message: "User Not Found",

  });

}

await prisma.user.delete({

  where: {

    id: oldUser.id,

  },

});

      res.json({
        message: "User Deleted Successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);
app.post(
  "/users",
  authMiddleware,
  adminMiddleware,
  subscriptionMiddleware,
  async (req, res) => {
console.log("REQ.USER =", req.user);
    try {

      const {
        name,
        email,
        password,
        role,
      } = req.body;

      const existingUser =
        await prisma.user.findUnique({

          where: {
            email,
          },

        });

      if (existingUser) {

        return res.status(400).json({
          message: "Email Already Exists",
        });

      }
const hashedPassword = await bcrypt.hash(password, 10);

const user = await prisma.user.create({

  data: {

    name,
    email,
    password: hashedPassword,

    role,

    storeId: req.user.storeId,

  },

});

      res.status(201).json({

        message: "User Added Successfully",

        user,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);
/* GET AVAILABLE YEARS */

app.get(
  "/dashboard/years",
  authMiddleware,
  subscriptionMiddleware,
  async (req, res) => {

    try {

      const rentals =
        await prisma.rental.findMany({

          select: {
  startDate: true,
}

        });

      const years = [
        ...new Set(
          rentals.map(
            rental =>
             rental.startDate.getFullYear()
          )
        ),
      ].sort((a, b) => b - a);

      res.json(years);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);
/* CREATE SALE */

app.post(
  "/sales",
  authMiddleware,
  subscriptionMiddleware,
  async (req, res) => {
console.log("REQ.USER =", req.user);
    try {

      const {
        customerId,
        productId,
        quantity,
        soldAt
      } = req.body;

      const product = await prisma.product.findUnique({

        where: {
          id: Number(productId)
        }

      });

      if (!product) {

        return res.status(404).json({

          message: "Product Not Found"

        });

      }

      if (product.type !== "SELL") {

return res.status(400).json({

message:"This product cannot be sold"

});

}

      if (product.stock < quantity) {

        return res.status(400).json({

          message: "Not enough stock"

        });

      }

      if(!product.salePrice){

return res.status(400).json({

message:"Product has no sale price"

});

}
const totalPrice =
Number(product.salePrice) *
Number(quantity);


      const sale = await prisma.sale.create({

        data: {

          customerId: Number(customerId),

          productId: Number(productId),

          quantity: Number(quantity),

          totalPrice,

          soldAt: new Date(soldAt),
          storeId:req.user.storeId

        }

      });


      const newStock =
        product.stock - Number(quantity);


      await prisma.product.update({

        where: {

          id: Number(productId)

        },

        data: {

          stock: newStock,

          status:
            newStock === 0
              ? "Out Of Stock"
              : product.status

        }

      });


      res.json({

        message: "Sale Created Successfully",

        sale

      });

    }

    catch(error){

console.log(error);

res.status(500).json({

message:error.message,

error:error

});

}

  }

);
/* GET SALES */

app.get(
  "/stores",
  authMiddleware,
  subscriptionMiddleware,
  superAdminMiddleware,
  async (req, res) => {

    try {

    const stores = await prisma.store.findMany({

  include: {
    users: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    },
    products: true,
    customers: true,
  },

  orderBy: {
    id: "desc",
  },

});

      res.json(stores);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error"
      });

    }

  }
);
app.post(
  "/stores",
  authMiddleware,
  subscriptionMiddleware,
  superAdminMiddleware,

async(req,res)=>{
console.log("REQ.USER =", req.user);
try{

const{

storeName,
phone,

adminName,
email,
password

}=req.body;



const existingUser =
await prisma.user.findUnique({

where:{
email
}

});


if(existingUser){

return res.status(400).json({

message:"Email already exists"

});

}



const store =
await prisma.store.create({

data:{

name:storeName,

phone,


subscriptionEnd:new Date(

Date.now()+30*24*60*60*1000

)

}

});



const hashedPassword =
await bcrypt.hash(

password,

10

);



const user =
await prisma.user.create({

data:{

name:adminName,

email,

password:hashedPassword,

role:"Admin",

storeId:store.id

}

});




res.json({

message:"Store Created",

store,

user

});


}

catch(error){

console.log(error);

console.log(error.code);

console.log(error.meta);

res.status(500).json({

message:"Server Error"

});

}


}

);
app.put(
  "/stores/:id/renew",
  authMiddleware,
  superAdminMiddleware,
  async (req, res) => {

    try {

      const { id } = req.params;
      const { plan } = req.body;

      let days = 30;

      if (plan === "Yearly") {
        days = 365;
      }

      const store = await prisma.store.update({

        where: {
          id: Number(id),
        },

        data: {

          plan,

          subscriptionStart: new Date(),

          subscriptionEnd: new Date(
            Date.now() + days * 24 * 60 * 60 * 1000
          ),

          isActive: true,

        },

      });

      res.json({

        message: "Subscription Renewed",

        store,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message: "Server Error",

      });

    }

  }
);
app.put(
  "/stores/:id/renew",
  authMiddleware,
  superAdminMiddleware,
  async (req, res) => {
    try {
      const storeId = Number(req.params.id);
      const { plan } = req.body;

      const now = new Date();

      let subscriptionEnd = new Date(now);

      if (plan === "Yearly") {
        subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
      } else {
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
      }

      const store = await prisma.store.update({
        where: {
          id: storeId,
        },
        data: {
          plan,
          isActive: true,
          subscriptionStart: now,
          subscriptionEnd,
        },
      });

      res.json({
        message: "Subscription renewed successfully",
        store,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);
app.put(
  "/stores/:id/toggle-status",
  authMiddleware,
  superAdminMiddleware,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      const store = await prisma.store.findUnique({
        where: { id },
      });

      if (!store) {
        return res.status(404).json({
          message: "Store not found",
        });
      }

      const updatedStore = await prisma.store.update({
        where: { id },
        data: {
          isActive: !store.isActive,
        },
      });

      res.json(updatedStore);

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);
app.get(
  "/super-admin/dashboard",
  authMiddleware,
  superAdminMiddleware,
  async (req, res) => {

    try {

      const totalStores = await prisma.store.count();

      const activeStores = await prisma.store.count({
        where: {
          isActive: true,
        },
      });

      const disabledStores = await prisma.store.count({
        where: {
          isActive: false,
        },
      });

      const totalUsers = await prisma.user.count();

      const totalProducts = await prisma.product.count();

      const totalCustomers = await prisma.customer.count();

      const expiredStores = await prisma.store.count({
        where: {
          subscriptionEnd: {
            lt: new Date(),
          },
        },
      });

      const monthlySales = await prisma.sale.aggregate({
        _sum: {
          totalPrice: true,
        },
        where: {
          soldAt: {
            gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            ),
          },
        },
      });

      const monthlyRentals = await prisma.rental.aggregate({
        _sum: {
          totalPrice: true,
        },
        where: {
          createdAt: {
            gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            ),
          },
        },
      });

      const monthlyRevenue =
        (monthlySales._sum.totalPrice || 0) +
        (monthlyRentals._sum.totalPrice || 0);
const subscriptionAlerts =
await prisma.store.findMany({

  where: {

    OR: [

      {
        subscriptionEnd: {
          lte: new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000
          )
        }
      },

      {
        isActive: false
      }

    ]

  },

  select: {

    id: true,

    name: true,

    subscriptionEnd: true,

    isActive: true,

  },

});
const recentStores = await prisma.store.findMany({

  take: 5,

  orderBy: {
    createdAt: "desc",
  },

  include: {
    users: true,
  },

});
      res.json({

  totalStores,

  activeStores,

  disabledStores,

  totalUsers,

  totalProducts,

  totalCustomers,

  expiredStores,

  monthlyRevenue,

  subscriptionAlerts,
  recentStores,

});

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);
const PORT = 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});