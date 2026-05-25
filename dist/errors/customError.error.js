"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    status;
    details;
    constructor(message, status, details) {
        super(message);
        this.status = status;
        this.details = details;
        this.name = "CustomError";
    }
}
exports.CustomError = CustomError;
