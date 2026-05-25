import express from "express";
import { createCheckoutSession, getCheckoutSession, lookupByEmail, verifyCodeHandler } from "../controllers/checkout.controller";

const router = express.Router();

router.post("/create-session", createCheckoutSession);
router.get("/session/:sessionId", getCheckoutSession);
router.get("/lookup", lookupByEmail);
router.get("/verify", verifyCodeHandler);

export default router;
