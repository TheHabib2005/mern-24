import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import { SignUpController } from "../controller/userController/Signup";
import { SigninController } from "../controller/userController/Signin";
import { GoogleLoginController } from "../controller/userController/GoogleLogin";

import { verifyEmailController } from "../controller/userController/VerifyEmail";

export const userRouter = express.Router();
import { validateRequest } from "../middleware/validateRequest";
import { userSignUpSchema, userSigninSchema } from "../zod-schema";
userRouter.post(
  "/signup",
  validateRequest(userSignUpSchema),
  asyncHandler(SignUpController)
);
userRouter.post(
  "/signin",
  validateRequest(userSigninSchema),
  asyncHandler(SigninController)
);

userRouter.post("/googleLogin", asyncHandler(GoogleLoginController));

userRouter.get("/verify-email", asyncHandler(verifyEmailController));
