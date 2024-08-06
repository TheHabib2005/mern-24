import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import signupController from "./src/controller/authentication/sign-up.js";
import signInController from "./src/controller/authentication/sign-in.js";
import googleLoginColtroller from "./src/controller/authentication/google.js";
import dbConnect from "./src/config/dbConnect.js";
import cookieParser from "cookie-parser";
import NodeCache from "node-cache";

const cache = new NodeCache();
import {
  CheckIsValidCode,
  GetVerificationCode,
} from "./src/controller/authentication/user-verification.js";
import Redis from "ioredis";
import Product from "./src/model/product.model.js";

import User from "./src/model/user.model.js";
import Order from "./src/model/order.model.js";

const redisClient = new Redis(
  "rediss://default:AZ8FAAIjcDExNDRmNDM4OTAyOTg0MzMwOTdjYzEyMjAyOTQwNDcwMHAxMA@amused-newt-40709.upstash.io:6379"
);

// console.log(redisClient);

const app = express();

dotenv.config();


app.use(cors({
  origin: true , // Reflects the request origin
  credentials: true, // Allows cookies to be sent with the requests
}));




app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
let PORT = process.env.PORT || 8000;
dbConnect();
app.listen(PORT, () => {
  console.log("server listening on" + PORT);
});

app.get("/products", (req, res) => {
  res.json();
});
app.get('/set-cookie', (req, res) => {
  // Set a cookie named 'myCookie' with value 'cookieValue'
  res.cookie('myCookie', 'cookieValue', {
    maxAge: 900000, // Expires after 15 minutes (900,000 milliseconds)
    httpOnly: true, // Cookie accessible only by the server
    secure: true, // Cookie will only be sent over HTTPS
    sameSite: 'strict' // Restrict cookie to same site requests
  });

  res.send('Cookie has been set!');
});
app.post("/user/sign-up", signupController);
app.post("/user/sign-in", signInController);
app.post("/user/google-login", googleLoginColtroller);
app.post("/user/get-verification-code", GetVerificationCode);
app.post("/user/user-verification", CheckIsValidCode);

app.get("/products/all", async (req, res) => {


  try {
    let cachedData = await redisClient.getex("product-data");
    let parseData = JSON.parse(cachedData)
    if (cachedData) {
      console.log("data get from redis: ");
      return res.status(200).json(parseData);
    }
    const data = await Product.find({});
    console.log("db fetch");
    redisClient.setex("product-data", 36000, JSON.stringify(data)); // Cache for 1 hour
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error fetching data");
  }
});
app.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  try {


    let singlePorduct = await redisClient.getex(id.toString());
    if(singlePorduct){
      console.log("single product redis");
      return res.status(200).json(JSON.parse(singlePorduct));
    }


    let cachedData = await redisClient.getex("product-data");
    let parseData = JSON.parse(cachedData)
    if (cachedData) {
      const productIndex = parseData.findIndex(item => item._id.toString() === id);
      console.log(productIndex);
      if(productIndex > -1){
        console.log("redis");
        return res.status(200).json(parseData[productIndex]);
      }
    }else{
      console.log("db fetch");
      const data = await Product.findById(id);
      redisClient.setex(id.toString(), 36000, JSON.stringify(data));
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching data",
    });
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



    let searchCacheData = await redisClient.getex(searchQuery);
    let searchDataParse = JSON.parse(searchCacheData)
    if(searchCacheData){
      console.log("searchCacheData product redis");
      return res.status(200).json(searchDataParse);
    }


    // Check if data is in Redis cache
    // let cachedData = await redisClient.getex("product-data") ;
    // let parseData = JSON.parse(cachedData)
    // if (cachedData) {
    //   console.log("cache cached data");
      
    //   const filterSearchData = parseData.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //   item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //   item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    //   item.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    //   return res.status(200).json(filterSearchData);
    // }

    let result = await Product.find({
      $and: [
        {
          $or: [
            { title: { $regex: searchQuery, $options: "i" } }, // case insensitive
            { description: { $regex: searchQuery, $options: "i" } },
            { tags: { $elemMatch: { $regex: searchQuery, $options: "i" } } },
            { brand: { $regex: searchQuery, $options: "i" } },
          ],
        },
      ],
    });
console.log("db fetch");

    // Cache the data in Redis
    redisClient.setex(searchQuery, 36000, JSON.stringify(result)); 
    return res.status(200).json(result);
  } catch (error) {}
});


app.get("/cart", async (req, res) => {

  let cachedData = await redisClient.getex("product-data");
  let data = JSON.parse(cachedData)

  return res.json(data)
})




app.get("/logout", (req,res) =>{
     res.clearCookie("auth-token");
     res.status(200).json({
      success: true,
      message:"user Logout successfully"
     })
})




app.post("/order/create",async (req,res) =>{
  try {
    const { userId,orderId, products, totalAmount, paymentMethod,deliveryInformation ,orderStatus} = req.body;



    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create the order
    const newOrder = new Order({  userId,orderId, products, totalAmount, paymentMethod,deliveryInformation,orderStatus });
    await newOrder.save();

    // Update the user's record with the new order
    
    user.orders.push(newOrder);
    await user.save();

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ success: false, message: 'Server Error', error });
  }

})



app.get('/orders/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, orders: user.orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

app.get("/orders" , async(req, res) => {
  try {
    let orders = await Order.find({});
    return res.json({ success: true, orders});
  } catch (error) {
    
  }
})

app.get("/order/:id" , async(req, res) => {
  let orderId = req.params.id
  try {
    let order = await Order.find({orderId:orderId});
    return res.json({ success: true, order});
  } catch (error) {
    
  }
})