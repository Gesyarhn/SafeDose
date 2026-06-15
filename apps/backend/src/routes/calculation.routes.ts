import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as calcService from "../services/calculation.service.js";

const router = Router();

// All calculation routes require authentication
router.use(requireAuth);

// ────────────────────────────────────────────────────────────
// Zod Schemas
// ────────────────────────────────────────────────────────────

const saveCalculationSchema = z.object({
  mode: z.enum(["standard", "igd"]),
  patientAge: z.number().int().min(0, "Patient age must be non-negative"),
  patientWeight: z.number().positive("Patient weight must be positive"),
  patientGender: z.string().nullish(),
  patientConditions: z.array(z.string()).optional(),
  drugId: z.string().nullish(),
  emergencyDrugId: z.string().nullish(),
  drugNameSnapshot: z.string().min(1, "Drug name is required"),
  preparationId: z.string().nullish(),
  indication: z.string().nullish(),
  doseMgPerKg: z.number().min(0, "Dose must be non-negative"),
  frequency: z.number().int().positive().nullish(),
  durationDays: z.number().int().positive().nullish(),
  dosePerAdminMg: z.number().min(0, "Dose per admin must be non-negative"),
  dosePerAdminMl: z.number().min(0).nullish(),
  totalDailyDoseMg: z.number().min(0, "Total daily dose must be non-negative"),
  supplyEstimate: z.string().nullish(),
});

const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// ────────────────────────────────────────────────────────────
// Routes
// ────────────────────────────────────────────────────────────

/**
 * POST / — Save a calculation to history
 */
router.post("/", validate(saveCalculationSchema), async (req: Request, res: Response) => {
  try {
    const calc = await calcService.saveCalculation(req.user!.id, req.body);
    res.status(201).json({ data: calc });
  } catch (error) {
    console.error("Error saving calculation:", error);
    res.status(500).json({ error: "Failed to save calculation" });
  }
});

/**
 * GET / — Get user's calculation history (paginated)
 * Query params: ?limit=20&offset=0
 */
router.get("/", validate(paginationSchema, "query"), async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query as unknown as { limit: number; offset: number };
    const result = await calcService.getUserHistory(req.user!.id, limit, offset);
    res.json({ data: result });
  } catch (error) {
    console.error("Error fetching calculation history:", error);
    res.status(500).json({ error: "Failed to fetch calculation history" });
  }
});

/**
 * GET /:id — Get a single calculation by ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const calc = await calcService.getCalculationById(req.params.id as string, req.user!.id);
    if (!calc) {
      res.status(404).json({ error: "Calculation not found" });
      return;
    }
    res.json({ data: calc });
  } catch (error) {
    console.error("Error fetching calculation:", error);
    res.status(500).json({ error: "Failed to fetch calculation" });
  }
});

/**
 * DELETE /:id — Delete a calculation from history
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await calcService.deleteCalculation(req.params.id as string, req.user!.id);
    if (!deleted) {
      res.status(404).json({ error: "Calculation not found" });
      return;
    }
    res.json({ message: "Calculation deleted", data: deleted });
  } catch (error) {
    console.error("Error deleting calculation:", error);
    res.status(500).json({ error: "Failed to delete calculation" });
  }
});

export default router;
