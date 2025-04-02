import { configDotenv } from "dotenv";

configDotenv();

export const config = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  CUSTOMER_JWT_SECRET: process.env.CUSTOMER_JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  EXPIRY_IN_SECONDS: process.env.EXPIRY_IN_SECONDS,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  PAYMENT_ENABLED: Boolean(process.env.PAYMENT_ENABLED) || true,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
};
