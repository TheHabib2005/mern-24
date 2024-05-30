"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpController = void 0;
const errorHandler_1 = __importDefault(require("../../middleware/errorHandler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const apiResponse_1 = require("../../../utils/apiResponse");
const emailTransport_1 = __importDefault(require("../../../utils/emailTransport"));
const user_model_1 = __importDefault(require("../../config/models/user.model"));
const fs_1 = __importDefault(require("fs"));
const SignUpController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const htmlContent = fs_1.default.readFileSync("./public/email.html", "utf8");
    let apiAccessKey = req.headers.access_key === process.env.API_ACCESS_KEY;
    if (!apiAccessKey) {
        let err = new errorHandler_1.default("you have no access key", 400);
        return next(err);
    }
    const { username, email, password } = req.body;
    const user = yield user_model_1.default.findOne({
        email: email,
    });
    if (user) {
        let err = new errorHandler_1.default("user already exist", 400);
        return next(err);
    }
    // hasing password
    const hashPassword = bcrypt_1.default.hashSync(password, 5);
    const newUser = yield user_model_1.default.create({
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
          <a href="http://localhost:8000/api/user/verify-email?uid=${newUser._id}&token=${Math.random() * 11100000000000}">Verify Email</a>
        </div>
      </body>
    </html>
    `,
    };
    let emailResponse = yield emailTransport_1.default.sendMail(message);
    if (emailResponse) {
        let response = (0, apiResponse_1.apiResponse)("user Created Successfully", 201, {
            user_id: newUser._id,
            email: newUser.email,
        });
        return res.json(response).status(201);
    }
    else {
        let err = new errorHandler_1.default("something went wrong", 400);
        return next(err);
    }
});
exports.SignUpController = SignUpController;
