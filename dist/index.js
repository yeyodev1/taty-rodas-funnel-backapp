"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const { app, server } = (0, app_1.createApp)();
const port = process.env.PORT || 8100;
if (!process.env.VERCEL) {
    server.timeout = 10 * 60 * 1000;
    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
exports.default = app;
