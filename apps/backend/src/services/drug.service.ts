import { eq, ilike, and, or } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { db } from "../db/index.js";
import { drugs, drugPreparations } from "../db/schema/index.js";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface CreateDrugInput {
  name: string;
  baseDoseMgPerKg: number;
  frequencyPerDay: number;
  type: string;
  indications?: string | null;
  contraindications?: string[];
  interactions?: string[];
  referenceSource?: string | null;
}

export interface UpdateDrugInput {
  name?: string;
  baseDoseMgPerKg?: number;
  frequencyPerDay?: number;
  type?: string;
  indications?: string | null;
  contraindications?: string[];
  interactions?: string[];
  referenceSource?: string | null;
}

export interface CreatePreparationInput {
  name: string;
  route: "oral_sirup" | "oral_tablet" | "oral_kapsul" | "injeksi_iv" | "injeksi_im" | "injeksi_sc";
  concentrationMg?: number | null;
  concentrationMl?: number | null;
  dosePerUnitMg?: number | null;
  packagingUnit?: string | null;
  volumePerPackaging?: number | null;
}

export interface UpdatePreparationInput {
  name?: string;
  route?: "oral_sirup" | "oral_tablet" | "oral_kapsul" | "injeksi_iv" | "injeksi_im" | "injeksi_sc";
  concentrationMg?: number | null;
  concentrationMl?: number | null;
  dosePerUnitMg?: number | null;
  packagingUnit?: string | null;
  volumePerPackaging?: number | null;
}

// ────────────────────────────────────────────────────────────
// Service Methods
// ────────────────────────────────────────────────────────────

/**
 * Search drugs by name or type. Only returns active drugs.
 * Includes their active preparations via a left join.
 */
export async function searchDrugs(query?: string) {
  const conditions = [eq(drugs.isActive, true)];

  if (query && query.trim().length > 0) {
    const pattern = `%${query.trim()}%`;
    conditions.push(
      or(
        ilike(drugs.name, pattern),
        ilike(drugs.type, pattern),
      )!,
    );
  }

  const drugRows = await db
    .select()
    .from(drugs)
    .where(and(...conditions))
    .orderBy(drugs.name);

  // Fetch preparations for each drug
  const drugIds = drugRows.map((d) => d.id);
  if (drugIds.length === 0) return [];

  const allPreps = await db
    .select()
    .from(drugPreparations)
    .where(
      and(
        eq(drugPreparations.isActive, true),
        or(...drugIds.map((id) => eq(drugPreparations.drugId, id)))!,
      ),
    );

  return drugRows.map((drug) => ({
    ...drug,
    preparations: allPreps.filter((p) => p.drugId === drug.id),
  }));
}

/**
 * Get a single drug by ID with all its active preparations.
 */
export async function getDrugById(id: string) {
  const [drug] = await db
    .select()
    .from(drugs)
    .where(and(eq(drugs.id, id), eq(drugs.isActive, true)));

  if (!drug) return null;

  const preparations = await db
    .select()
    .from(drugPreparations)
    .where(
      and(
        eq(drugPreparations.drugId, id),
        eq(drugPreparations.isActive, true),
      ),
    );

  return { ...drug, preparations };
}

/**
 * Create a new drug.
 */
export async function createDrug(data: CreateDrugInput) {
  const id = createId();
  const [drug] = await db
    .insert(drugs)
    .values({
      id,
      name: data.name,
      baseDoseMgPerKg: data.baseDoseMgPerKg,
      frequencyPerDay: data.frequencyPerDay,
      type: data.type,
      indications: data.indications ?? null,
      contraindications: data.contraindications ?? null,
      interactions: data.interactions ?? null,
      referenceSource: data.referenceSource ?? null,
    })
    .returning();

  return drug;
}

/**
 * Update an existing drug. Sets updatedAt to now.
 */
export async function updateDrug(id: string, data: UpdateDrugInput) {
  const [drug] = await db
    .update(drugs)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(drugs.id, id))
    .returning();

  return drug ?? null;
}

/**
 * Soft-delete a drug by setting isActive to false.
 */
export async function softDeleteDrug(id: string) {
  const [drug] = await db
    .update(drugs)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(drugs.id, id))
    .returning();

  return drug ?? null;
}

/**
 * Add a preparation to a drug.
 */
export async function addPreparation(drugId: string, data: CreatePreparationInput) {
  const id = createId();
  const [prep] = await db
    .insert(drugPreparations)
    .values({
      id,
      drugId,
      name: data.name,
      route: data.route,
      concentrationMg: data.concentrationMg ?? null,
      concentrationMl: data.concentrationMl ?? null,
      dosePerUnitMg: data.dosePerUnitMg ?? null,
      packagingUnit: data.packagingUnit ?? null,
      volumePerPackaging: data.volumePerPackaging ?? null,
    })
    .returning();

  return prep;
}

/**
 * Update a preparation.
 */
export async function updatePreparation(prepId: string, data: UpdatePreparationInput) {
  const [prep] = await db
    .update(drugPreparations)
    .set(data)
    .where(eq(drugPreparations.id, prepId))
    .returning();

  return prep ?? null;
}

/**
 * Soft-delete a preparation by setting isActive to false.
 */
export async function removePreparation(prepId: string) {
  const [prep] = await db
    .update(drugPreparations)
    .set({ isActive: false })
    .where(eq(drugPreparations.id, prepId))
    .returning();

  return prep ?? null;
}
