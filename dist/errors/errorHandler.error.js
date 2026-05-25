"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const axios_1 = __importDefault(require("axios"));
class ErrorHandler {
    slackWebhookUrl;
    constructor(slackWebhookUrl) {
        this.slackWebhookUrl = slackWebhookUrl;
    }
    handleHttpError(res, message, status, error) {
        console.error(`[${status}] ${message}`, error.details || "");
        if (this.slackWebhookUrl && status >= 500) {
            this.notifySlack(message, status, error).catch(() => { });
        }
        res.status(status).json({ message });
    }
    async notifySlack(message, status, error) {
        await axios_1.default.post(this.slackWebhookUrl, {
            text: `:rotating_light: *Error ${status}*\n>${message}\n\`\`\`${JSON.stringify(error.details || error.stack || "", null, 2)}\`\`\``,
        });
    }
}
exports.ErrorHandler = ErrorHandler;
