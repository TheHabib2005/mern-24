import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json(
          e.errors.map((err) => {
            return {
              success: false,
              field: err.path[0],
              message: err.message,
            };
          })
        );
      }
      next(e);
    }
  };
