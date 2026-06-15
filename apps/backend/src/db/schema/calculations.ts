import { pgTable, pgEnum, text, real, integer, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { user } from "./auth.js";
import { drugs } from "./drugs.js";
import { emergencyDrugs } from "./emergency-drugs.js";

export const calculationModeEnum = pgEnum("calculation_mode", ["standard", "igd"]);

export const calculationHistory = pgTable("calculation_history", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  mode: calculationModeEnum("mode").notNull().default("standard"),
  patientAge: integer("patient_age").notNull(),
  patientWeight: real("patient_weight").notNull(),
  patientGender: text("patient_gender"),
  patientConditions: jsonb("patient_conditions").$type<string[]>(),
  drugId: text("drug_id").references(() => drugs.id, { onDelete: "set null" }),
  emergencyDrugId: text("emergency_drug_id").references(() => emergencyDrugs.id, { onDelete: "set null" }),
  drugNameSnapshot: text("drug_name_snapshot").notNull(),
  preparationId: text("preparation_id"),
  indication: text("indication"),
  doseMgPerKg: real("dose_mg_per_kg").notNull(),
  frequency: integer("frequency"),
  durationDays: integer("duration_days"),
  dosePerAdminMg: real("dose_per_admin_mg").notNull(),
  dosePerAdminMl: real("dose_per_admin_ml"),
  totalDailyDoseMg: real("total_daily_dose_mg").notNull(),
  supplyEstimate: text("supply_estimate"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("calc_history_user_id_idx").on(table.userId),
  createdAtIdx: index("calc_history_created_at_idx").on(table.createdAt),
}));
