import { eq, and, desc, count } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { db } from "../db/index.js";
import { calculationHistory } from "../db/schema/index.js";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface SaveCalculationInput {
  mode: "standard" | "igd";
  patientAge: number;
  patientWeight: number;
  patientGender?: string | null;
  patientConditions?: string[];
  drugId?: string | null;
  emergencyDrugId?: string | null;
  drugNameSnapshot: string;
  preparationId?: string | null;
  indication?: string | null;
  doseMgPerKg: number;
  frequency?: number | null;
  durationDays?: number | null;
  dosePerAdminMg: number;
  dosePerAdminMl?: number | null;
  totalDailyDoseMg: number;
  supplyEstimate?: string | null;
}

// ────────────────────────────────────────────────────────────
// Service Methods
// ────────────────────────────────────────────────────────────

/**
 * Save a calculation to the user's history.
 */
export async function saveCalculation(userId: string, data: SaveCalculationInput) {
  const id = createId();
  const [calc] = await db
    .insert(calculationHistory)
    .values({
      id,
      userId,
      mode: data.mode,
      patientAge: data.patientAge,
      patientWeight: data.patientWeight,
      patientGender: data.patientGender ?? null,
      patientConditions: data.patientConditions ?? null,
      drugId: data.drugId ?? null,
      emergencyDrugId: data.emergencyDrugId ?? null,
      drugNameSnapshot: data.drugNameSnapshot,
      preparationId: data.preparationId ?? null,
      indication: data.indication ?? null,
      doseMgPerKg: data.doseMgPerKg,
      frequency: data.frequency ?? null,
      durationDays: data.durationDays ?? null,
      dosePerAdminMg: data.dosePerAdminMg,
      dosePerAdminMl: data.dosePerAdminMl ?? null,
      totalDailyDoseMg: data.totalDailyDoseMg,
      supplyEstimate: data.supplyEstimate ?? null,
    })
    .returning();

  return calc;
}

/**
 * Get paginated calculation history for a user, newest first.
 */
export async function getUserHistory(userId: string, limit = 20, offset = 0) {
  const [totalResult] = await db
    .select({ count: count() })
    .from(calculationHistory)
    .where(eq(calculationHistory.userId, userId));

  const total = totalResult?.count ?? 0;

  const items = await db
    .select()
    .from(calculationHistory)
    .where(eq(calculationHistory.userId, userId))
    .orderBy(desc(calculationHistory.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    items,
    total,
    limit,
    offset,
    hasMore: offset + items.length < total,
  };
}

/**
 * Get a single calculation by ID, with ownership check.
 */
export async function getCalculationById(id: string, userId: string) {
  const [calc] = await db
    .select()
    .from(calculationHistory)
    .where(
      and(
        eq(calculationHistory.id, id),
        eq(calculationHistory.userId, userId),
      ),
    );

  return calc ?? null;
}

/**
 * Delete a calculation by ID, with ownership check.
 * Hard-deletes since calculation history is user-owned data.
 */
export async function deleteCalculation(id: string, userId: string) {
  const [deleted] = await db
    .delete(calculationHistory)
    .where(
      and(
        eq(calculationHistory.id, id),
        eq(calculationHistory.userId, userId),
      ),
    )
    .returning();

  return deleted ?? null;
}
