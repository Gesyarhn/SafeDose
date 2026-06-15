CREATE TYPE "public"."route_type" AS ENUM('oral_sirup', 'oral_tablet', 'oral_kapsul', 'injeksi_iv', 'injeksi_im', 'injeksi_sc');--> statement-breakpoint
CREATE TYPE "public"."calculation_mode" AS ENUM('standard', 'igd');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "drug_preparations" (
	"id" text PRIMARY KEY NOT NULL,
	"drug_id" text NOT NULL,
	"name" text NOT NULL,
	"route" "route_type" NOT NULL,
	"concentration_mg" real,
	"concentration_ml" real,
	"dose_per_unit_mg" real,
	"packaging_unit" text,
	"volume_per_packaging" real,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "drugs" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"base_dose_mg_per_kg" real NOT NULL,
	"frequency_per_day" integer NOT NULL,
	"type" text NOT NULL,
	"indications" text,
	"contraindications" jsonb,
	"interactions" jsonb,
	"reference_source" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "emergency_drugs" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"dose_mg_per_kg" real NOT NULL,
	"max_dose_mg" real NOT NULL,
	"min_dose_mg" real,
	"concentration_mg" real NOT NULL,
	"concentration_ml" real NOT NULL,
	"notes" text NOT NULL,
	"category" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calculation_history" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"mode" "calculation_mode" DEFAULT 'standard' NOT NULL,
	"patient_age" integer NOT NULL,
	"patient_weight" real NOT NULL,
	"patient_gender" text,
	"patient_conditions" jsonb,
	"drug_id" text,
	"emergency_drug_id" text,
	"drug_name_snapshot" text NOT NULL,
	"preparation_id" text,
	"indication" text,
	"dose_mg_per_kg" real NOT NULL,
	"frequency" integer,
	"duration_days" integer,
	"dose_per_admin_mg" real NOT NULL,
	"dose_per_admin_ml" real,
	"total_daily_dose_mg" real NOT NULL,
	"supply_estimate" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_favorite_drugs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"drug_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_favorite_drugs_user_id_drug_id_unique" UNIQUE("user_id","drug_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drug_preparations" ADD CONSTRAINT "drug_preparations_drug_id_drugs_id_fk" FOREIGN KEY ("drug_id") REFERENCES "public"."drugs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculation_history" ADD CONSTRAINT "calculation_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculation_history" ADD CONSTRAINT "calculation_history_drug_id_drugs_id_fk" FOREIGN KEY ("drug_id") REFERENCES "public"."drugs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculation_history" ADD CONSTRAINT "calculation_history_emergency_drug_id_emergency_drugs_id_fk" FOREIGN KEY ("emergency_drug_id") REFERENCES "public"."emergency_drugs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorite_drugs" ADD CONSTRAINT "user_favorite_drugs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorite_drugs" ADD CONSTRAINT "user_favorite_drugs_drug_id_drugs_id_fk" FOREIGN KEY ("drug_id") REFERENCES "public"."drugs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "calc_history_user_id_idx" ON "calculation_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "calc_history_created_at_idx" ON "calculation_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "fav_user_id_idx" ON "user_favorite_drugs" USING btree ("user_id");