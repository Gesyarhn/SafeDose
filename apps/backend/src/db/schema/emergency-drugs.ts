import { pgTable, text, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const emergencyDrugs = pgTable("emergency_drugs", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  doseMgPerKg: real("dose_mg_per_kg").notNull(),
  maxDoseMg: real("max_dose_mg").notNull(),
  minDoseMg: real("min_dose_mg"),
  concentrationMg: real("concentration_mg").notNull(),
  concentrationMl: real("concentration_ml").notNull(),
  notes: text("notes").notNull(),
  category: text("category"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
