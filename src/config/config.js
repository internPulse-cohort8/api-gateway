import dotenv from "dotenv";
dotenv.config();

function requiredEnv(name){
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env variable: ${name}`);
  return value;
}

export const config = {
  AUTH: requiredEnv("AUTH_SERVICE_URL"),
  WALLET: requiredEnv("WALLET_SERVICE_URL"),
  CARD: requiredEnv("CARD_SERVICE_URL"),
  JWT_SECRET: requiredEnv("JWT_SECRET"),
  PORT: requiredEnv("PORT"),
};