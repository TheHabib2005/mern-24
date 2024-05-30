import { z } from "zod";
export const userSignUpSchema = z.object({
  username: z.string().min(5, "username must be at least 5 characters"),

  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userSigninSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
