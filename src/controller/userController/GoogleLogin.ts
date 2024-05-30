import { NextFunction, Request, Response } from "express";
import CustomError from "../../middleware/errorHandler";
import bcrypt from "bcrypt";
import { apiResponse } from "../../../utils/apiResponse";
import emailTransport from "../../../utils/emailTransport";
import User from "../../config/models/user.model";
import fs from "fs";
import jwt from "jsonwebtoken";
export const GoogleLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let apiAccessKey = req.headers.access_key === process.env.API_ACCESS_KEY;
  if (!apiAccessKey) {
    let err = new CustomError("you have no access key", 400);
    return next(err);
  }

  const { username, email, isVerifyed, profilePicture } = req.body;
};
