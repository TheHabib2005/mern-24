import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import signupController from "./src/controller/authentication/sign-up.js";
import signInController from "./src/controller/authentication/sign-in.js";
import googleLoginColtroller from "./src/controller/authentication/google.js";
import dbConnect from "./src/config/dbConnect.js";
import cookieParser from "cookie-parser";
import NodeCache from "node-cache";
import {
  CheckIsValidCode,
  GetVerificationCode,
} from "./src/controller/authentication/user-verification.js";
import Redis from "ioredis";
import Product from "./src/model/product.model.js";

import User from "./src/model/user.model.js";

// const redisClient = new Redis(
//   "redis://default:AeM6AAIjcDEyYWE0YzJlZmYxYTk0ODdmYTc4ZWE0MjQyNjExYzE0MXAxMA@stable-ape-58170.upstash.io:6379"
// );

const app = express();

dotenv.config();

const FRONTEND_URL = "https://hamida-me.vercel.app";

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


app.post("/user/sign-up", signupController);
app.post("/user/sign-in", signInController);
app.post("/user/google-login", googleLoginColtroller);
app.post("/user/get-verification-code", GetVerificationCode);
app.post("/user/user-verification", CheckIsValidCode);
const client = new NodeCache({ stdTTL: 0 }); 

app.get("/products/all", async (req, res) => {
  try {
    // const data = await Product.find({});

    let cacheData = await client.get("data")

    if(cacheData){
      return res.json(cacheData)
    }

    let data = await Product.find({});
    await client.set('data', data);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error fetching data");
  }
});
