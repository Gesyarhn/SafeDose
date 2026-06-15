import { pgTable, text, timestamp, unique, index } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { user } from "./auth.js";
import { drugs } from "./drugs.js";

export const userFavoriteDrugs = pgTable("user_favorite_drugs", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  drugId: text("drug_id").notNull().references(() => drugs.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  uniqueUserDrug: unique().on(table.userId, table.drugId),
  userIdIdx: index("fav_user_id_idx").on(table.userId),
}));
