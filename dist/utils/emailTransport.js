"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTransport = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.emailTransport = nodemailer_1.default.createTransport({
    // host: "smtp.gmail.com",
    // secure: true,
    // auth: {
    //   user: "mdwear2005@gmail.com",
    //   pass: process.env.NEXT_PUBLIC_GOOGLE_SECRET_KEY,
    // },
    service: "gmail",
    auth: {
        user: "mdwear2005@gmail.com",
        pass: "ysdmetyqjkvxkkii",
    },
});
exports.default = exports.emailTransport;
