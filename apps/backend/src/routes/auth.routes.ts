import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../auth/index.js";

const router = Router();

/**
 * Better Auth catch-all handler.
 * All auth routes (sign-up, sign-in, sign-out, social, verify, etc.)
 * are handled by Better Auth automatically.
 */
router.all("/api/auth/*splat", toNodeHandler(auth));

export default router;
