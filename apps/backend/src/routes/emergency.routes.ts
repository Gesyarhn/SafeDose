import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as emergencyService from "../services/emergency.service.js";

const router = Router();

// ────────────────────────────────────────────────────────────
// Zod Schemas
// ────────────────────────────────────────────────────────────

const createEmergencyDrugSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  doseMgPerKg: z.number().positive("Dose must be positive"),
  maxDoseMg: z.number().positive("Max dose must be positive"),
  minDoseMg: z.number().positive().nullish(),
  concentrationMg: z.number().positive("Concentration (mg) is required"),
  concentrationMl: z.number().positive("Concentration (mL) is required"),
  notes: z.string().min(1, "Notes are required"),
  category: z.string().max(100).nullish(),
  sortOrder: z.number().int().min(0).optional(),
});

const updateEmergencyDrugSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  doseMgPerKg: z.number().positive().optional(),
  maxDoseMg: z.number().positive().optional(),
  minDoseMg: z.number().positive().nullish(),
  concentrationMg: z.number().positive().optional(),
  concentrationMl: z.number().positive().optional(),
  notes: z.string().min(1).optional(),
  category: z.string().max(100).nullish(),
  sortOrder: z.number().int().min(0).optional(),
});

const searchQuerySchema = z.object({
  q: z.string().optional(),
});

// ────────────────────────────────────────────────────────────
// Public Routes
// ────────────────────────────────────────────────────────────

/**
 * GET / — List/search emergency drugs
 */
router.get("/", validate(searchQuerySchema, "query"), async (req: Request, res: Response) => {
  try {
    const { q } = req.query as { q?: string };
    const drugs = await emergencyService.listEmergencyDrugs(q);
    res.json({ data: drugs });
  } catch (error) {
    console.error("Error listing emergency drugs:", error);
    res.status(500).json({ error: "Failed to list emergency drugs" });
  }
});

/**
 * GET /:id — Get emergency drug by ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const drug = await emergencyService.getEmergencyDrugById(req.params.id as string);
    if (!drug) {
      res.status(404).json({ error: "Emergency drug not found" });
      return;
    }
    res.json({ data: drug });
  } catch (error) {
    console.error("Error fetching emergency drug:", error);
    res.status(500).json({ error: "Failed to fetch emergency drug" });
  }
});

// ────────────────────────────────────────────────────────────
// Admin Routes
// ────────────────────────────────────────────────────────────

/**
 * POST / — Create emergency drug (admin only)
 */
router.post(
  "/",
  requireAdmin,
  validate(createEmergencyDrugSchema),
  async (req: Request, res: Response) => {
    try {
      const drug = await emergencyService.createEmergencyDrug(req.body);
      res.status(201).json({ data: drug });
    } catch (error) {
      console.error("Error creating emergency drug:", error);
      res.status(500).json({ error: "Failed to create emergency drug" });
    }
  },
);

/**
 * PUT /:id — Update emergency drug (admin only)
 */
router.put(
  "/:id",
  requireAdmin,
  validate(updateEmergencyDrugSchema),
  async (req: Request, res: Response) => {
    try {
      const drug = await emergencyService.updateEmergencyDrug(req.params.id as string, req.body);
      if (!drug) {
        res.status(404).json({ error: "Emergency drug not found" });
        return;
      }
      res.json({ data: drug });
    } catch (error) {
      console.error("Error updating emergency drug:", error);
      res.status(500).json({ error: "Failed to update emergency drug" });
    }
  },
);

/**
 * DELETE /:id — Soft-delete emergency drug (admin only)
 */
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const drug = await emergencyService.softDeleteEmergencyDrug(req.params.id as string);
    if (!drug) {
      res.status(404).json({ error: "Emergency drug not found" });
      return;
    }
    res.json({ message: "Emergency drug deleted", data: drug });
  } catch (error) {
    console.error("Error deleting emergency drug:", error);
    res.status(500).json({ error: "Failed to delete emergency drug" });
  }
});

export default router;
