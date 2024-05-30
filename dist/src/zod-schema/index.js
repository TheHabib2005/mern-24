"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSigninSchema = exports.userSignUpSchema = void 0;
const zod_1 = require("zod");
exports.userSignUpSchema = zod_1.z.object({
    username: zod_1.z.string().min(5, "username must be at least 5 characters"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
exports.userSigninSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
