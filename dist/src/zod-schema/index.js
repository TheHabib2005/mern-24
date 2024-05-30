"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignUpSchema = void 0;
const zod_1 = require("zod");
exports.userSignUpSchema = zod_1.z
    .object({
    username: zod_1.z.string().min(5, "username must be at least 5 characters"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: zod_1.z
        .string()
        .min(8, "Confirm Password must be at least 8 characters long"),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
