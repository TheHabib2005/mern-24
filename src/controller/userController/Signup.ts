import { NextFunction, Request, Response } from "express";
import CustomError from "../../middleware/errorHandler";
import bcrypt from "bcrypt";
import { apiResponse } from "../../../utils/apiResponse";
import emailTransport from "../../../utils/emailTransport";
import User from "../../config/models/user.model";
import fs from "fs";
export const SignUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const htmlContent = fs.readFileSync("./public/email.html", "utf8");

  let apiAccessKey = req.headers.access_key === process.env.API_ACCESS_KEY;
  if (!apiAccessKey) {
    let err = new CustomError("you have no access key", 400);
    return next(err);
  }

  const { username, email, password } = req.body;

  const user = await User.findOne({
    email: email,
  });

  if (user) {
    let err = new CustomError("user already exist", 400);
    return next(err);
  }

  // hasing password
  const hashPassword = bcrypt.hashSync(password, 5);

  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
  });

  var message = {
    from: "mdwear2005@gmail.com",
    to: email,
    subject: "Please Verify your Email Address",
    html: `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>verify email</title>
        <style>
          * {
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 500;
          }
       
          .container h3 {
            text-transform: capitalize;
            display:flex;
            align-items: center;
            flex-wrap: wrap;
          }
    
          .container h3 span a {
            text-transform: uppercase;
            background: blue;
            font-size:16px
            color: white;
            padding: 5px;
            border-radius: 5px;
            cursor: pointer;
           
          }
    
          .container p {
            text-transform: capitalize;
            font-size: 16px;
            line-height: 30px;
          }
    
          .container a {
            text-decoration: none;
            text-transform: capitalize;
            font-size: 20px;
            cursor: pointer;
            background: blue;
            color: white;
            padding: 7px;
            border-radius: 6px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hello, ${newUser.username}</h1>
          <h3>
            thanks to singup our app <span><a href="">shop-24.com.bd</a></span>
          </h3>
          <p>
            please click the verify email button below to verify your email address!
          </p>
          <a href="http://localhost:8000/api/user/verify-email?uid=${
            newUser._id
          }&token=${Math.random() * 11100000000000}">Verify Email</a>
        </div>
      </body>
    </html>
    `,
  };

  let emailResponse = await emailTransport.sendMail(message);

  if (emailResponse) {
    let response = apiResponse("user Created Successfully", 201, {
      user_id: newUser._id,
      email: newUser.email,
    });
    return res.json(response).status(201);
  } else {
    let err = new CustomError("something went wrong", 400);
    return next(err);
  }
};
