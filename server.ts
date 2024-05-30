import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { errorHandler } from "./src/middleware/errorHandler";
import cookieParser from "cookie-parser";
import path from "path";
import { conncetToDb } from "./src/config/dbConncet";
import { userRouter } from "./src/routes/userRouter";
import fs from "fs";
import cors from "cors";

const app = express();
conncetToDb();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

dotenv.config();
app.use(cookieParser());
let port = 8000;
app.listen(port, () => {
  console.log("Server is running on port " + port);
});

app.get("/", (req: Request, res: Response) => {
  res.send(`hello world`);
});

app.use("/api/user/", userRouter);

app.use(errorHandler);
app.get("*", (req, res) => {
  res.status(404).send("not found");
});
