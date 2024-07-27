import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import signupController from "./src/controller/authentication/sign-up.js";
import signInController from "./src/controller/authentication/sign-in.js";
import googleLoginColtroller from "./src/controller/authentication/google.js";
import dbConnect from "./src/config/dbConnect.js";
import cookieParser from "cookie-parser";
import {
  CheckIsValidCode,
  GetVerificationCode,
} from "./src/controller/authentication/user-verification.js";
import Redis from "ioredis";
import Product from "./src/model/product.model.js";
import Cart from "./src/model/cart.model.js";
import User from "./src/model/user.model.js";

const redisClient = new Redis(
  "rediss://default:AZ8FAAIjcDExNDRmNDM4OTAyOTg0MzMwOTdjYzEyMjAyOTQwNDcwMHAxMA@amused-newt-40709.upstash.io:6379"
);

// console.log(redisClient);

const app = express();

dotenv.config();
// const redisClient = new Redis("rediss://default:********@amused-newt-40709.upstash.io:6379", {
//   password: "AZ8FAAIjcDExNDRmNDM4OTAyOTg0MzMwOTdjYzEyMjAyOTQwNDcwMHAxMA",
// });
// Replace with your frontend URL
const FRONTEND_URL = "http://localhost:3000";

// Configure CORS options
const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  credentials: true, // Allow credentials (cookies, authorization headers, TLS client certificates)
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
console.log(process.env.JWT_SECRICTKEY);
let PORT = process.env.PORT || 8000;
dbConnect();
app.listen(PORT, () => {
  console.log("server listening on" + PORT);
});

app.get("/products", (req, res) => {
  res.json();
});

app.post("/user/sign-up", signupController);
app.post("/user/sign-in", signInController);
app.post("/user/google-login", googleLoginColtroller);
app.post("/user/get-verification-code", GetVerificationCode);
app.post("/user/user-verification", CheckIsValidCode);

app.post("/products/data", async (req, res) => {
  let { query } = req.body;
  console.log(JSON.stringify(query));

  try {
    let dataQuery = {};

    if (query.brands) {
      dataQuery.brand = { $in: query.brands };
    }
    // Check if data is in Redis cache
    const cachedData = await redisClient.get(JSON.stringify(query));
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // If not in cache, fetch from MongoDB

    const data = await Product.find(dataQuery);

    // Cache the data in Redis
    redisClient.setex(JSON.stringify(query), 3600, JSON.stringify(data)); // Cache for 1 hour
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error fetching data");
  }
});

app.get("/products/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Check if data is in Redis cache
    const cachedData = await redisClient.get(id);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // If not in cache, fetch from MongoDB

    const data = await Product.find({ _id: id });

    // Cache the data in Redis
    redisClient.setex(id, 3600, JSON.stringify(data)); // Cache for 1 hour

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error fetching data");
  }
});

app.post("/add-to-cart", async (req, res) => {
  const { productId, userId, quantity } = req.body;

  try {
    let newCart = {
      userId,
      items: [{ productId, quantity: 1 }],
    };
    let data = await User.findById({ _id: userId });
    data.cart = newCart;
    // await data.save();
    return res.status(200).json({ data, message: "Product added to cart" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error adding to cart");
  }
});

app.get("/products/search/:searchQuery", async (req, res) => {
  const searchQuery = req.params.searchQuery;

 try {

    // Check if data is in Redis cache
    const cachedData = await redisClient.get(searchQuery);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

  let result = await Product.find({
    $and: [
      {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },  // case insensitive
          { description: { $regex: searchQuery, $options: "i" } },
          { tags: { $elemMatch: { $regex: searchQuery, $options: "i" } } },
          { brand: { $regex: searchQuery, $options: "i" } }
        ]
      },
      //  brand: { $regex: "brand name", $options: "i" } }  // case insensitive
    ]
  });

    // Cache the data in Redis
    redisClient.setex(searchQuery, 3600, JSON.stringify(result)); // Cache for 1 hour

    return res.status(200).json(result);

 } catch (error) {
  
 }
});
