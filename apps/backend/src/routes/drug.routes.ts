import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { requireAdmin, optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as drugService from "../services/drug.service.js";

const router = Router();

// ────────────────────────────────────────────────────────────
// Zod Schemas
// ────────────────────────────────────────────────────────────

const routeTypeValues = [
  "oral_sirup", "oral_tablet", "oral_kapsul",
  "injeksi_iv", "injeksi_im", "injeksi_sc",
] as const;

const createDrugSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  baseDoseMgPerKg: z.number().positive("Base dose must be positive"),
  frequencyPerDay: z.number().int().positive("Frequency must be a positive integer"),
  type: z.string().min(1, "Type is required").max(200),
  indications: z.string().nullish(),
  contraindications: z.array(z.string()).optional(),
  interactions: z.array(z.string()).optional(),
  referenceSource: z.string().nullish(),
});

const updateDrugSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  baseDoseMgPerKg: z.number().positive().optional(),
  frequencyPerDay: z.number().int().positive().optional(),
  type: z.string().min(1).max(200).optional(),
  indications: z.string().nullish(),
  contraindications: z.array(z.string()).optional(),
  interactions: z.array(z.string()).optional(),
  referenceSource: z.string().nullish(),
});

const createPreparationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  route: z.enum(routeTypeValues),
  concentrationMg: z.number().positive().nullish(),
  concentrationMl: z.number().positive().nullish(),
  dosePerUnitMg: z.number().positive().nullish(),
  packagingUnit: z.string().max(100).nullish(),
  volumePerPackaging: z.number().positive().nullish(),
});

const updatePreparationSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  route: z.enum(routeTypeValues).optional(),
  concentrationMg: z.number().positive().nullish(),
  concentrationMl: z.number().positive().nullish(),
  dosePerUnitMg: z.number().positive().nullish(),
  packagingUnit: z.string().max(100).nullish(),
  volumePerPackaging: z.number().positive().nullish(),
});

const searchQuerySchema = z.object({
  q: z.string().optional(),
});

// ────────────────────────────────────────────────────────────
// Public Routes
// ────────────────────────────────────────────────────────────

/**
 * GET / — Search/list drugs
 * Query params: ?q=search_term
 */
router.get("/", validate(searchQuerySchema, "query"), async (req: Request, res: Response) => {
  try {
    const { q } = req.query as { q?: string };
    const drugs = await drugService.searchDrugs(q);
    res.json({ data: drugs });
  } catch (error) {
    console.error("Error searching drugs:", error);
    res.status(500).json({ error: "Failed to search drugs" });
  }
});

/**
 * GET /:id — Get drug by ID with preparations
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const drug = await drugService.getDrugById(req.params.id as string);
    if (!drug) {
      res.status(404).json({ error: "Drug not found" });
      return;
    }
    res.json({ data: drug });
  } catch (error) {
    console.error("Error fetching drug:", error);
    res.status(500).json({ error: "Failed to fetch drug" });
  }
});

// ────────────────────────────────────────────────────────────
// Admin Routes
// ────────────────────────────────────────────────────────────

/**
 * POST / — Create a new drug (admin only)
 */
router.post("/", requireAdmin, validate(createDrugSchema), async (req: Request, res: Response) => {
  try {
    const drug = await drugService.createDrug(req.body);
    res.status(201).json({ data: drug });
  } catch (error) {
    console.error("Error creating drug:", error);
    res.status(500).json({ error: "Failed to create drug" });
  }
});

/**
 * PUT /:id — Update a drug (admin only)
 */
router.put("/:id", requireAdmin, validate(updateDrugSchema), async (req: Request, res: Response) => {
  try {
    const drug = await drugService.updateDrug(req.params.id as string, req.body);
    if (!drug) {
      res.status(404).json({ error: "Drug not found" });
      return;
    }
    res.json({ data: drug });
  } catch (error) {
    console.error("Error updating drug:", error);
    res.status(500).json({ error: "Failed to update drug" });
  }
});

/**
 * DELETE /:id — Soft-delete a drug (admin only)
 */
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const drug = await drugService.softDeleteDrug(req.params.id as string);
    if (!drug) {
      res.status(404).json({ error: "Drug not found" });
      return;
    }
    res.json({ message: "Drug deleted", data: drug });
  } catch (error) {
    console.error("Error deleting drug:", error);
    res.status(500).json({ error: "Failed to delete drug" });
  }
});

// ────────────────────────────────────────────────────────────
// Preparation Routes (admin only)
// ────────────────────────────────────────────────────────────

/**
 * POST /:drugId/preparations — Add preparation to a drug
 */
router.post(
  "/:drugId/preparations",
  requireAdmin,
  validate(createPreparationSchema),
  async (req: Request, res: Response) => {
    try {
      // Verify drug exists
      const drug = await drugService.getDrugById(req.params.drugId as string);
      if (!drug) {
        res.status(404).json({ error: "Drug not found" });
        return;
      }
      const prep = await drugService.addPreparation(req.params.drugId as string, req.body);
      res.status(201).json({ data: prep });
    } catch (error) {
      console.error("Error adding preparation:", error);
      res.status(500).json({ error: "Failed to add preparation" });
    }
  },
);

/**
 * PUT /preparations/:prepId — Update a preparation
 */
router.put(
  "/preparations/:prepId",
  requireAdmin,
  validate(updatePreparationSchema),
  async (req: Request, res: Response) => {
    try {
      const prep = await drugService.updatePreparation(req.params.prepId as string, req.body);
      if (!prep) {
        res.status(404).json({ error: "Preparation not found" });
        return;
      }
      res.json({ data: prep });
    } catch (error) {
      console.error("Error updating preparation:", error);
      res.status(500).json({ error: "Failed to update preparation" });
    }
  },
);

/**
 * DELETE /preparations/:prepId — Soft-delete a preparation
 */
router.delete(
  "/preparations/:prepId",
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const prep = await drugService.removePreparation(req.params.prepId as string);
      if (!prep) {
        res.status(404).json({ error: "Preparation not found" });
        return;
      }
      res.json({ message: "Preparation removed", data: prep });
    } catch (error) {
      console.error("Error removing preparation:", error);
      res.status(500).json({ error: "Failed to remove preparation" });
    }
  },
);

export default router;
