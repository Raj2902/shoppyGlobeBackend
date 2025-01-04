//import express
import express from "express";
//declaring the ports
const port = 3000;
const app = express();
//import mongoose
import mongoose from "mongoose";
import Product from "./model/product.cjs";
import Cart from "./model/cart.cjs";
//importing the userSchema
import User from "./model/user.cjs";
//using jsonwebtoken
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const saltRounds = 10;
const secretKey = "slingshot";

//parse the body
app.use(express.json());

//make a connection to mongodb
mongoose
  .connect("mongodb://localhost:27017/ShoppyGlobe")
  .then(() => {
    //connection successfull check
    console.log("connected to database");
  })
  .catch((error) => {
    //connection error check
    console.log("Error connecting database::", error);
  });

//verify jwt token
function verifyToken(req, res, next) {
  const token = req.header("authorization");
  if (!token) return res.status(401).send({ message: "Access Denied" });
  try {
    const decoded = jwt.verify(token.split(" ")[1], secretKey);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
}

//register a new user
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      try {
        // Store hash in your password DB.
        let user = await User.create({ name, email, password: hash });
        if (!user) {
          return res.status(400).json({ message: "User not created" });
        }
        res.status(201).json({ message: "User created successfully" });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//login the user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email." });
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (!result) {
        return res.status(400).json({ message: "Invalid password" });
      } else if (result) {
        //generate token
        const token = jwt.sign(
          {
            userId: user._id,
          },
          secretKey,
          { expiresIn: "1h" }
        );
        res.status(200).json({ message: "Logged in successfully", token });
      } else if (err) {
        const err = new Error();
        err.message = "Error logging in";
        throw err;
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Fetch the list of products from MongoDB.
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//delete product
app.delete("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    return res.status(200).json({ message: "product deleted sucessfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//update a product through its id
app.put("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    return res.status(200).json({ message: "Product successfully updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//update the quantity of the product in the cart
app.put("/cart/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Cart.updateOne(
      { _id: id, user: req.user },
      {
        OrderedQuantity: req.body.OrderedQuantity,
      }
    );
    if (!product.modifiedCount) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//get a specific product using objectId
app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const foundPrd = await Product.findById(id);
    if (!foundPrd) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(foundPrd);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//create a new product
app.post("/product", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    if (!product) {
      return res.status(404).json({ message: "Unable to create new product." });
    }
    return res.status(201).json({ message: "New product created." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//add a new product to the cart
app.post("/cart", verifyToken, async (req, res) => {
  try {
    const addToCart = await Cart.create({ ...req.body, user: req.user });
    if (!addToCart) {
      return res
        .status(404)
        .json({ message: "Product not added successfully" });
    }
    return res.status(200).json({ message: "Product added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//get the all products in the cart
app.get("/cart", verifyToken, async (req, res) => {
  try {
    const allPrdInCart = await Cart.find({ user: req.user });
    if (!allPrdInCart) {
      return res.status(404).json({ message: "No products in cart" });
    }
    return res.status(200).json(allPrdInCart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//remove a specific product from the cart
app.delete("/cart/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const removedPrd = await Cart.deleteOne({ _id: id, user: req.user });
    if (!removedPrd.deletedCount) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    return res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app
  .listen(port, () => {
    //check for successfull server
    console.log(`Server is runing on port ${port}`);
  })
  .on("error", (err) => {
    //check for server error
    console.error(`Error starting server: ${err}`);
  });
