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
exports.SigninController = void 0;
const errorHandler_1 = __importDefault(require("../../middleware/errorHandler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const apiResponse_1 = require("../../../utils/apiResponse");
const user_model_1 = __importDefault(require("../../config/models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SigninController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate input
        const { email, password } = req.body;
        // Check API access key
        if (req.headers.access_key !== process.env.API_ACCESS_KEY) {
            throw new errorHandler_1.default("You have no access key", 403);
        }
        // Find user by email
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            throw new errorHandler_1.default("User not found", 404);
        }
        // Check if user is verified
        if (!user.isVerifyed) {
            throw new errorHandler_1.default("User is not verified", 400);
        }
        // Compare password
        const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new errorHandler_1.default("Invalid credentials", 401);
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_KEY, {
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
        const response = (0, apiResponse_1.apiResponse)("User logged in successfully", 200, {
            user: { email: user.email, id: user._id },
        });
        return res.status(200).json(response);
    }
    catch (err) {
        if (err instanceof errorHandler_1.default) {
            return next(err);
        }
        console.error("Internal Server Error:", err);
        next(new errorHandler_1.default("Something went wrong", 500));
    }
});
exports.SigninController = SigninController;
