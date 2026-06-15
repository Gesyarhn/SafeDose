import { eq, ilike, and, or } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { db } from "../db/index.js";
import { emergencyDrugs } from "../db/schema/index.js";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface CreateEmergencyDrugInput {
  name: string;
  doseMgPerKg: number;
  maxDoseMg: number;
  minDoseMg?: number | null;
  concentrationMg: number;
  concentrationMl: number;
  notes: string;
  category?: string | null;
  sortOrder?: number;
}

export interface UpdateEmergencyDrugInput {
  name?: string;
  doseMgPerKg?: number;
  maxDoseMg?: number;
  minDoseMg?: number | null;
  concentrationMg?: number;
  concentrationMl?: number;
  notes?: string;
  category?: string | null;
  sortOrder?: number;
}

// ────────────────────────────────────────────────────────────
// Service Methods
// ────────────────────────────────────────────────────────────

/**
 * List emergency drugs with optional search by name. Only returns active drugs.
 */
export async function listEmergencyDrugs(query?: string) {
  const conditions = [eq(emergencyDrugs.isActive, true)];

  if (query && query.trim().length > 0) {
    conditions.push(ilike(emergencyDrugs.name, `%${query.trim()}%`));
  }

  return db
    .select()
    .from(emergencyDrugs)
    .where(and(...conditions))
    .orderBy(emergencyDrugs.sortOrder, emergencyDrugs.name);
}

/**
 * Get a single emergency drug by ID.
 */
export async function getEmergencyDrugById(id: string) {
  const [drug] = await db
    .select()
    .from(emergencyDrugs)
    .where(and(eq(emergencyDrugs.id, id), eq(emergencyDrugs.isActive, true)));

  return drug ?? null;
}

/**
 * Create a new emergency drug.
 */
export async function createEmergencyDrug(data: CreateEmergencyDrugInput) {
  const id = createId();
  const [drug] = await db
    .insert(emergencyDrugs)
    .values({
      id,
      name: data.name,
      doseMgPerKg: data.doseMgPerKg,
      maxDoseMg: data.maxDoseMg,
      minDoseMg: data.minDoseMg ?? null,
      concentrationMg: data.concentrationMg,
      concentrationMl: data.concentrationMl,
      notes: data.notes,
      category: data.category ?? null,
      sortOrder: data.sortOrder ?? 0,
    })
    .returning();

  return drug;
}

/**
 * Update an existing emergency drug.
 */
export async function updateEmergencyDrug(id: string, data: UpdateEmergencyDrugInput) {
  const [drug] = await db
    .update(emergencyDrugs)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(emergencyDrugs.id, id))
    .returning();

  return drug ?? null;
}

/**
 * Soft-delete an emergency drug.
 */
export async function softDeleteEmergencyDrug(id: string) {
  const [drug] = await db
    .update(emergencyDrugs)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(emergencyDrugs.id, id))
    .returning();

  return drug ?? null;
}
