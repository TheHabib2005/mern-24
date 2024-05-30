"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const Signup_1 = require("../controller/userController/Signup");
const Signin_1 = require("../controller/userController/Signin");
const GoogleLogin_1 = require("../controller/userController/GoogleLogin");
const VerifyEmail_1 = require("../controller/userController/VerifyEmail");
exports.userRouter = express_1.default.Router();
const validateRequest_1 = require("../middleware/validateRequest");
const zod_schema_1 = require("../zod-schema");
exports.userRouter.post("/signup", (0, validateRequest_1.validateRequest)(zod_schema_1.userSignUpSchema), (0, asyncHandler_1.default)(Signup_1.SignUpController));
exports.userRouter.post("/signin", (0, validateRequest_1.validateRequest)(zod_schema_1.userSigninSchema), (0, asyncHandler_1.default)(Signin_1.SigninController));
exports.userRouter.post("/googleLogin", (0, asyncHandler_1.default)(GoogleLogin_1.GoogleLoginController));
exports.userRouter.get("/verify-email", (0, asyncHandler_1.default)(VerifyEmail_1.verifyEmailController));
