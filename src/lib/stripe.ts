// lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    features: [
      "Up to 3 projects",
      "Up to 5 team members",
      "Basic task management",
    ],
  },
  PRO: {
    name: "Pro",
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      "Unlimited projects",
      "Unlimited team members",
      "Advanced task management",
      "Real-time collaboration",
      "Priority support",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "Advanced analytics",
      "SLA guarantees",
    ],
  },
};