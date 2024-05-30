import { NextFunction, Request, Response } from "express";
import CustomError from "./errorHandler";

export const isUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isCookieMatch = req.cookies.authToken;
  if (isCookieMatch) {
    next();
  } else {
    let err = new CustomError("Access denied", 400);
    next(err);
  }
};
