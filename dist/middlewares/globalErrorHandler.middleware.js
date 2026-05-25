"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = globalErrorHandler;
const errorHandler_error_1 = require("../errors/errorHandler.error");
const slackWebhookUrl = process.env.SLACK_ERROR_WEBHOOK || "";
function globalErrorHandler(error, req, res, _next) {
    const handler = new errorHandler_error_1.ErrorHandler(slackWebhookUrl);
    const status = error.status || 500;
    const message = error.message || "Internal Server Error";
    handler.handleHttpError(res, message, status, error);
}
