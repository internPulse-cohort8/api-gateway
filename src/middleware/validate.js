import { config } from "../config/config.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        mmessage: "Authorization token required",
      });
    }

    const response = await fetch(`${config.AUTH_SERVICE_URL}/validate-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Gateway-Request": "true",
      },
    //   body: JSON.stringify({
    //     service_context: req.originalUrl,
    //   }),
    });

    if (!response.ok) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }

    const data = await response.json();

    if (data.valid) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid Token",
      });
    }
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: "Auth service not reachable",
      error
    });
  }
};
