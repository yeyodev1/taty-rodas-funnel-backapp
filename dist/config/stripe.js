"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectMode = detectMode;
exports.getStripe = getStripe;
const stripe_1 = __importDefault(require("stripe"));
const LIVE_KEY = process.env.STRIPE_SECRET_KEY_LIVE || process.env.STRIPE_SECRET_KEY || "";
const TEST_KEY = process.env.STRIPE_SECRET_KEY_TEST || "";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _stripeLive;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _stripeTest;
function getKey(mode) {
    if (mode === "test")
        return TEST_KEY;
    return LIVE_KEY;
}
function getOrCreateInstance(mode) {
    const key = getKey(mode);
    if (!key) {
        throw new Error(`STRIPE_SECRET_KEY_${mode.toUpperCase()} no está definida en .env`);
    }
    if (mode === "test") {
        if (!_stripeTest)
            _stripeTest = new stripe_1.default(key);
        return _stripeTest;
    }
    if (!_stripeLive)
        _stripeLive = new stripe_1.default(key);
    return _stripeLive;
}
function detectMode(origin) {
    if (!origin || origin.includes("localhost") || origin.includes("testing-")) {
        return "test";
    }
    return "live";
}
function getStripe(mode) {
    return getOrCreateInstance(mode || detectMode());
}
