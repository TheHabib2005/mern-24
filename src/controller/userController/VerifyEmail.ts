import { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import User from "../../config/models/user.model";

export const verifyEmailController = async (req: Request, res: Response) => {
  let id = req.query.uid;

  let findAndUpdate = await User.findByIdAndUpdate(
    { _id: id },
    { isVerifyed: true }
  );

  res.send(`
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>verify email</title>
    <style>
      * {
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 600;
      }
      .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
      }
      .container h3 {
        text-transform: capitalize;
      }
      .container h1 {
        text-transform: capitalize;
      }

      .container h3 span a {
        text-transform: uppercase;
        background: blue;
        color: white;
        padding: 8px;
        border-radius: 5px;
        cursor: pointer;
      }

      .container p {
        text-transform: capitalize;
        font-size: 18px;
        line-height: 30px;
      }

      .container a {
        text-decoration: none;
        text-transform: capitalize;
        font-size: 22px;
        cursor: pointer;
        background: blue;
        color: white;
        padding: 10px;
        border-radius: 11px;
      }
      h4{
        color:green
      }
      .check{
        color:green
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>congratulations</h1>
      <h3>
        your email verification success. <span class="check">✔✔</span>
      </h3>
      <h3>
      please Login in your account at <span><a href="shop-24.com.bd">shop-24.com.bd</a></span>
      </h3>
    </div>
  </body>
</html>
`);
};
