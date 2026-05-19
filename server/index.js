const adminMiddleware = require("./middleware/adminMiddleware");
const authMiddleware = require("./middleware/authMiddleware");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});
const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);


/* HOME ROUTE */

app.get("/", (req, res) => {

  res.json({
    message: "Server Running Successfully",
  });

});

/* GET PRODUCTS */

app.get("/products", async (req, res) => {

  try {

    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(products);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

});
app.post(
  "/products",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

  try {

    const {
      name,
      category,
      size,
      color,
      salePrice,
      rentalPrice,
      stock,
      status,
    } = req.body;

    const newProduct = await prisma.product.create({

      data: {

        name,

        category,

        size,

        color,

        salePrice: Number(salePrice),

        rentalPrice: Number(rentalPrice),

        stock: Number(stock),

        status,

      },

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

});

/* DELETE PRODUCT */
app.delete(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

  try {

    const productId = Number(req.params.id);

    await prisma.product.delete({

      where: {
        id: productId,
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

});


const PORT = 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});