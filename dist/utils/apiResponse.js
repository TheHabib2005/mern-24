"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiResponse = void 0;
const apiResponse = (message, statusCode, data) => {
    return {
        success: true,
        statusCode,
        data: data,
        message,
    };
};
exports.apiResponse = apiResponse;
