import { pgTable, pgEnum, text, real, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const routeTypeEnum = pgEnum("route_type", [
  "oral_sirup", "oral_tablet", "oral_kapsul",
  "injeksi_iv", "injeksi_im", "injeksi_sc",
]);

export const drugs = pgTable("drugs", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  baseDoseMgPerKg: real("base_dose_mg_per_kg").notNull(),
  frequencyPerDay: integer("frequency_per_day").notNull(),
  type: text("type").notNull(),
  indications: text("indications"),
  contraindications: jsonb("contraindications").$type<string[]>(),
  interactions: jsonb("interactions").$type<string[]>(),
  referenceSource: text("reference_source"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const drugPreparations = pgTable("drug_preparations", {
  id: text("id").primaryKey(),
  drugId: text("drug_id").notNull().references(() => drugs.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  route: routeTypeEnum("route").notNull(),
  concentrationMg: real("concentration_mg"),
  concentrationMl: real("concentration_ml"),
  dosePerUnitMg: real("dose_per_unit_mg"),
  packagingUnit: text("packaging_unit"),
  volumePerPackaging: real("volume_per_packaging"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
