import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { config } from "./config/config.js";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authenticate } from "./middleware/validate.js";

const app = express();

app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes",
  },
});

app.use(limiter);

// Auth Route
app.use(
  "/auth",
  createProxyMiddleware({
    target: config.AUTH,
    changeOrigin: true,
    pathRewrite: { "^/auth": "" },
  })
);

// Crypto wallet route
app.use(
  "/wallet",
  authenticate,
  createProxyMiddleware({
    target: config.WALLET,
    changeOrigin: true,
    pathRewrite: { "^/wallet": "" },
  })
);

// Virtual card route
app.use(
  "/card",
  authenticate,
  createProxyMiddleware({
    target: config.CARD,
    changeOrigin: true,
    pathRewrite: { "^/card": "" },
  })
);

app.listen(config.PORT, () => {
  console.log(`Listening on port ${config.PORT}`);
});
