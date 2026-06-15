import cors from "cors";
import { env } from "./env.js";

export const corsMiddleware = cors({
  origin: env.NODE_ENV === 'production' ? env.CORS_ORIGIN : true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
