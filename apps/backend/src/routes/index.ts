import { Router } from "express";
import authRoutes from "./auth.routes.js";
import drugRoutes from "./drug.routes.js";
import emergencyRoutes from "./emergency.routes.js";
import calculationRoutes from "./calculation.routes.js";
import favoriteRoutes from "./favorite.routes.js";

const router = Router();

// Auth routes are mounted at root level (Better Auth handles /api/auth/*)
router.use(authRoutes);

// API routes
router.use("/api/drugs", drugRoutes);
router.use("/api/emergency-drugs", emergencyRoutes);
router.use("/api/calculations", calculationRoutes);
router.use("/api/favorites", favoriteRoutes);

export default router;
