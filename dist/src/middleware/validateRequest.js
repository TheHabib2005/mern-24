"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            return res.status(400).json(e.errors.map((err) => {
                return {
                    success: false,
                    field: err.path[0],
                    message: err.message,
                };
            }));
        }
        next(e);
    }
};
exports.validateRequest = validateRequest;
