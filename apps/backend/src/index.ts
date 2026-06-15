import express from "express";
import { env } from "./config/env.js";
import { corsMiddleware } from "./config/cors.js";
import routes from "./routes/index.js";

const app = express();

// Global middleware
app.use(corsMiddleware);
app.use(express.json());

// Mount all routes
app.use(routes);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

// Start server
app.listen(env.PORT, () => {
  console.log(`🚀 SafeDose API running on http://localhost:${env.PORT}`);
  console.log(`📦 Environment: ${env.NODE_ENV}`);
});

export default app;
