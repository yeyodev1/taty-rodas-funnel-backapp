import Stripe from "stripe";

const LIVE_KEY =
  process.env.STRIPE_SECRET_KEY_LIVE || process.env.STRIPE_SECRET_KEY || "";
const TEST_KEY = process.env.STRIPE_SECRET_KEY_TEST || "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _stripeLive: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _stripeTest: any;

function getKey(mode: string): string {
  if (mode === "test") return TEST_KEY;
  return LIVE_KEY;
}

function getOrCreateInstance(mode: string) {
  const key = getKey(mode);
  if (!key) {
    throw new Error(
      `STRIPE_SECRET_KEY_${mode.toUpperCase()} no está definida en .env`
    );
  }
  if (mode === "test") {
    if (!_stripeTest) _stripeTest = new Stripe(key);
    return _stripeTest;
  }
  if (!_stripeLive) _stripeLive = new Stripe(key);
  return _stripeLive;
}

export function detectMode(origin?: string): string {
  if (!origin || origin.includes("localhost") || origin.includes("testing-")) {
    return "test";
  }
  return "live";
}

export function getStripe(mode?: string) {
  return getOrCreateInstance(mode || detectMode());
}
