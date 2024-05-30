"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({
        success: false,
        status,
        message,
    });
};
exports.errorHandler = errorHandler;
// src/CustomError.ts
class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        // Set the prototype explicitly to maintain proper prototype chain
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.default = CustomError;
