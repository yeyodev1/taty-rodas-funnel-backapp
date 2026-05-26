"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const axios_1 = require("axios");
const routes_1 = __importDefault(require("./routes"));
const globalErrorHandler_middleware_1 = require("./middlewares/globalErrorHandler.middleware");
const ALLOWED_ORIGINS = [
    "http://localhost:8100",
    "http://localhost:8080",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:8101",
    "https://testing-storybrand-frontend.bakano.ec",
    "https://tatianarodascoach.com",
    "https://funnel-taty-rodas.netlify.app",
    "https://taty-rodas-tickets.netlify.app"
];
const corsOptions = {
    origin: (origin, callback) => {
        callback(null, !origin || ALLOWED_ORIGINS.includes(origin));
    },
    credentials: true,
};
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)(corsOptions));
    app.use(express_1.default.json({ limit: "50mb" }));
    app.get("/", (_req, res) => {
        res.status(axios_1.HttpStatusCode.Ok).send({
            message: "Taty Rodas Funnel API is running successfully."
        });
        return;
    });
    (0, routes_1.default)(app);
    app.use(globalErrorHandler_middleware_1.globalErrorHandler);
    const server = http_1.default.createServer(app);
    return { app, server };
}
