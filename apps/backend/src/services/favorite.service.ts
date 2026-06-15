import { eq, and } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { db } from "../db/index.js";
import { userFavoriteDrugs, drugs } from "../db/schema/index.js";

// ────────────────────────────────────────────────────────────
// Service Methods
// ────────────────────────────────────────────────────────────

/**
 * Get all favorite drugs for a user, joined with drug data.
 */
export async function getUserFavorites(userId: string) {
  const favorites = await db
    .select({
      id: userFavoriteDrugs.id,
      userId: userFavoriteDrugs.userId,
      drugId: userFavoriteDrugs.drugId,
      createdAt: userFavoriteDrugs.createdAt,
      drug: {
        id: drugs.id,
        name: drugs.name,
        baseDoseMgPerKg: drugs.baseDoseMgPerKg,
        frequencyPerDay: drugs.frequencyPerDay,
        type: drugs.type,
      },
    })
    .from(userFavoriteDrugs)
    .innerJoin(drugs, eq(userFavoriteDrugs.drugId, drugs.id))
    .where(
      and(
        eq(userFavoriteDrugs.userId, userId),
        eq(drugs.isActive, true),
      ),
    )
    .orderBy(userFavoriteDrugs.createdAt);

  return favorites;
}

/**
 * Add a drug to user's favorites.
 * Handles unique constraint gracefully — returns existing favorite if already present.
 */
export async function addFavorite(userId: string, drugId: string) {
  // Check if already favorited
  const [existing] = await db
    .select()
    .from(userFavoriteDrugs)
    .where(
      and(
        eq(userFavoriteDrugs.userId, userId),
        eq(userFavoriteDrugs.drugId, drugId),
      ),
    );

  if (existing) {
    return { favorite: existing, created: false };
  }

  const id = createId();
  const [favorite] = await db
    .insert(userFavoriteDrugs)
    .values({ id, userId, drugId })
    .returning();

  return { favorite, created: true };
}

/**
 * Remove a drug from user's favorites.
 */
export async function removeFavorite(userId: string, drugId: string) {
  const [deleted] = await db
    .delete(userFavoriteDrugs)
    .where(
      and(
        eq(userFavoriteDrugs.userId, userId),
        eq(userFavoriteDrugs.drugId, drugId),
      ),
    )
    .returning();

  return deleted ?? null;
}

/**
 * Check if a drug is in user's favorites.
 */
export async function isFavorited(userId: string, drugId: string): Promise<boolean> {
  const [result] = await db
    .select({ id: userFavoriteDrugs.id })
    .from(userFavoriteDrugs)
    .where(
      and(
        eq(userFavoriteDrugs.userId, userId),
        eq(userFavoriteDrugs.drugId, drugId),
      ),
    );

  return !!result;
}
