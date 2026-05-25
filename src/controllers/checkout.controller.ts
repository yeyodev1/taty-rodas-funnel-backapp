import { Request, Response } from "express";
import { getStripe, detectMode } from "../config/stripe";
import crypto from "crypto";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `RISE-${code}`;
}

function getVerifyCode(session: any): string {
  if (session.metadata?.verify_code) return session.metadata.verify_code;
  const id = session.id || "";
  const clean = id.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return `RISE-${clean.slice(-6)}`;
}

export async function createCheckoutSession(req: Request, res: Response) {
  const { priceId, customerName, customerEmail } = req.body;

  if (!priceId) {
    res.status(400).json({ message: "priceId is required" });
    return;
  }

  const origin = req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
  const baseUrl = origin.replace(/\/+$/, "");
  const mode = detectMode(origin);
  const verifyCode = generateCode();

  try {
    const session = await getStripe(mode).checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: customerEmail || undefined,
      metadata: {
        ...(customerName && { customer_name: customerName }),
        verify_code: verifyCode,
      },
      success_url: `${baseUrl}/compra-exitosa?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/sin-espacio`,
    });

    res.json({ sessionUrl: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ message: "Error creating checkout session", error: error.message });
  }
}

export async function getCheckoutSession(req: Request, res: Response) {
  const sessionId = req.params.sessionId as string;

  if (!sessionId) {
    res.status(400).json({ message: "sessionId is required" });
    return;
  }

  const origin = req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
  const mode = detectMode(origin);

  try {
    const session = await getStripe(mode).checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer_details"],
    });

    res.json({
      id: session.id,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      amountTotal: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
      verifyCode: getVerifyCode(session),
      createdAt: session.created,
    });
  } catch (error: any) {
    console.error("Stripe retrieve error:", error);
    res.status(500).json({ message: "Error retrieving session", error: error.message });
  }
}

export async function lookupByEmail(req: Request, res: Response) {
  const email = (req.query.email as string || "").trim().toLowerCase();

  if (!email) {
    res.status(400).json({ message: "email is required" });
    return;
  }

  const origin = req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
  const mode = detectMode(origin);

  try {
    const result = await getStripe(mode).checkout.sessions.list({
      limit: 100,
      expand: ["data.customer_details"],
    });

    const matches = result.data
      .filter((s: any) => {
        const se = s.customer_details?.email?.toLowerCase() || s.customer_email?.toLowerCase() || "";
        return se === email && s.payment_status === "paid";
      })
      .map((s: any) => ({
        id: s.id,
        paymentStatus: s.payment_status,
        amountTotal: s.amount_total,
        currency: s.currency,
        createdAt: s.created,
        metadata: s.metadata,
        verifyCode: getVerifyCode(s),
      }));

    res.json({ sessions: matches });
  } catch (error: any) {
    console.error("Stripe lookup error:", error);
    res.status(500).json({ message: "Error looking up sessions", error: error.message });
  }
}

export async function verifyCodeHandler(req: Request, res: Response) {
  let code = (req.query.code || req.body?.code || "").toString().trim().toUpperCase();

  if (!code) {
    res.status(400).json({ message: "code is required" });
    return;
  }

  if (!code.startsWith("RISE-")) {
    code = `RISE-${code}`;
  }

  const origin = req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
  const mode = detectMode(origin);

  try {
    const result = await getStripe(mode).checkout.sessions.list({
      limit: 100,
      expand: ["data.customer_details"],
    });

    const match = result.data.find((s: any) => {
      const stored = getVerifyCode(s);
      return stored === code && s.payment_status === "paid";
    });

    if (!match) {
      res.status(404).json({ valid: false, message: "Código no válido" });
      return;
    }

    res.json({
      valid: true,
      session: {
        id: match.id,
        customerName: match.customer_details?.name || match.metadata?.customer_name || null,
        customerEmail: match.customer_details?.email || null,
        amountTotal: match.amount_total,
        currency: match.currency,
        createdAt: match.created,
        verifyCode: getVerifyCode(match),
      },
    });
  } catch (error: any) {
    console.error("Stripe verify error:", error);
    res.status(500).json({ message: "Error verifying code", error: error.message });
  }
}
