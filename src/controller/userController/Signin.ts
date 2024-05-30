import { NextFunction, Request, Response } from "express";
import CustomError from "../../middleware/errorHandler";
import bcrypt from "bcrypt";
import { apiResponse } from "../../../utils/apiResponse";
import User from "../../config/models/user.model";
import jwt from "jsonwebtoken";
import Joi from "joi";
import dotenv from "dotenv";

dotenv.config();

export const SigninController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate input

    const { email, password } = req.body;

    // Check API access key
    if (req.headers.access_key !== process.env.API_ACCESS_KEY) {
      throw new CustomError("You have no access key", 403);
    }

    // Find user by email
    const user: any = await User.findOne({ email });
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    // Check if user is verified
    if (!user.isVerifyed) {
      throw new CustomError("User is not verified", 400);
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new CustomError("Invalid credentials", 401);
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY!, {
      expiresIn: "1d",
    });

    // Set cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: isProduction,
      expires: new Date(Date.now() + 86400000), // 1 day
    });

    // Send response
    const response = apiResponse("User logged in successfully", 200, {
      user: { email: user.email, id: user._id },
    });
    return res.status(200).json(response);
  } catch (err) {
    if (err instanceof CustomError) {
      return next(err);
    }
    console.error("Internal Server Error:", err);
    next(new CustomError("Something went wrong", 500));
  }
};
