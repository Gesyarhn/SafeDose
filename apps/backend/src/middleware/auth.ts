import type { Request, Response, NextFunction } from "express";
import { auth } from "../auth/index.js";
import { fromNodeHeaders } from "better-auth/node";

// Extend Express Request type to include user and session
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; name: string; email: string; role: string } | null;
      session?: { id: string; token: string } | null;
    }
  }
}

/**
 * Middleware that requires authentication.
 * Returns 401 if no valid session is found.
 * Attaches `req.user` and `req.session` on success.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    req.user = session.user as any;
    req.session = session.session as any;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}

/**
 * Middleware that optionally attaches auth info.
 * Does NOT fail if user is not authenticated — sets req.user to null instead.
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    req.user = (session?.user as any) ?? null;
    req.session = (session?.session as any) ?? null;
  } catch {
    req.user = null;
    req.session = null;
  }
  next();
}

/**
 * Middleware that requires authentication AND admin role.
 * Returns 403 if user is not an admin.
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || (session.user as any).role !== "admin") {
      res.status(403).json({ error: "Forbidden: Admin access required" });
      return;
    }

    req.user = session.user as any;
    req.session = session.session as any;
    next();
  } catch {
    res.status(403).json({ error: "Forbidden" });
  }
}
