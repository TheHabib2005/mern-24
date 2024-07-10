import express, { NextFunction, Request, Response } from "express";
import { conncetToDb } from "./config/dbConncet";

const app = express();
conncetToDb();

let port = 8000;
app.listen(port, () => {
  console.log("Server is running on port " + port);
});

app.get("/", (req: Request, res: Response) => {
  res.send(`hello world 2`);
});
