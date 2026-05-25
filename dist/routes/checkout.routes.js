"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkout_controller_1 = require("../controllers/checkout.controller");
const router = express_1.default.Router();
router.post("/create-session", checkout_controller_1.createCheckoutSession);
router.get("/session/:sessionId", checkout_controller_1.getCheckoutSession);
router.get("/lookup", checkout_controller_1.lookupByEmail);
router.get("/verify", checkout_controller_1.verifyCodeHandler);
exports.default = router;
