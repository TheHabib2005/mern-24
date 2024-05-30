import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({
    success: false,
    status,

    message,
  });
};
// src/CustomError.ts
class CustomError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    // Set the prototype explicitly to maintain proper prototype chain
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default CustomError;
