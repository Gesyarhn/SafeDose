import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as favoriteService from "../services/favorite.service.js";

const router = Router();

// All favorite routes require authentication
router.use(requireAuth);

// ────────────────────────────────────────────────────────────
// Zod Schemas
// ────────────────────────────────────────────────────────────

const addFavoriteSchema = z.object({
  drugId: z.string().min(1, "Drug ID is required"),
});

// ────────────────────────────────────────────────────────────
// Routes
// ────────────────────────────────────────────────────────────

/**
 * GET / — Get all user's favorite drugs (with drug data)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const favorites = await favoriteService.getUserFavorites(req.user!.id);
    res.json({ data: favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

/**
 * POST / — Add a drug to favorites
 */
router.post("/", validate(addFavoriteSchema), async (req: Request, res: Response) => {
  try {
    const { drugId } = req.body;
    const result = await favoriteService.addFavorite(req.user!.id, drugId);
    res.status(result.created ? 201 : 200).json({ data: result.favorite });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

/**
 * GET /check/:drugId — Check if a drug is favorited
 */
router.get("/check/:drugId", async (req: Request, res: Response) => {
  try {
    const isFav = await favoriteService.isFavorited(req.user!.id, req.params.drugId as string);
    res.json({ data: { isFavorited: isFav } });
  } catch (error) {
    console.error("Error checking favorite:", error);
    res.status(500).json({ error: "Failed to check favorite status" });
  }
});

/**
 * DELETE /:drugId — Remove a drug from favorites
 */
router.delete("/:drugId", async (req: Request, res: Response) => {
  try {
    const deleted = await favoriteService.removeFavorite(req.user!.id, req.params.drugId as string);
    if (!deleted) {
      res.status(404).json({ error: "Favorite not found" });
      return;
    }
    res.json({ message: "Favorite removed" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

export default router;
