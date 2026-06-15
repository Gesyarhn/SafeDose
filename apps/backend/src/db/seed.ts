import { db } from "../db/index.js";
import { drugs, drugPreparations, emergencyDrugs } from "../db/schema/index.js";

/**
 * SafeDose seed script.
 *
 * Inserts standard drugs with their preparations and emergency drugs.
 * Uses onConflictDoNothing() so it's safe to run multiple times (idempotent).
 *
 * Run with: npm run db:seed
 */
async function seed() {
  console.log("🌱 Starting SafeDose seed...\n");

  // ──────────────────────────────────────────────────────────
  // 1. Standard Drugs
  // ──────────────────────────────────────────────────────────
  console.log("📦 Seeding standard drugs...");

  const standardDrugsData = [
    {
      id: "drug_amoksisilin",
      name: "Amoksisilin",
      baseDoseMgPerKg: 50,
      frequencyPerDay: 3,
      type: "Antibakteri • Golongan Beta-Laktam",
    },
    {
      id: "drug_paracetamol",
      name: "Paracetamol",
      baseDoseMgPerKg: 15,
      frequencyPerDay: 4,
      type: "Analgesik & Antipiretik",
    },
    {
      id: "drug_epinefrin",
      name: "Epinefrin",
      baseDoseMgPerKg: 0.01,
      frequencyPerDay: 1,
      type: "Simpatomimetik • Resusitasi & Anafilaksis",
    },
  ];

  await db
    .insert(drugs)
    .values(standardDrugsData)
    .onConflictDoNothing();

  console.log(`  ✅ Inserted ${standardDrugsData.length} drugs`);

  // ──────────────────────────────────────────────────────────
  // 2. Drug Preparations
  // ──────────────────────────────────────────────────────────
  console.log("💊 Seeding drug preparations...");

  const preparationsData = [
    // ── Amoksisilin preparations ──
    {
      id: "amox_syr_125",
      drugId: "drug_amoksisilin",
      name: "Sirup Kering 125mg/5mL",
      route: "oral_sirup" as const,
      concentrationMg: 125,
      concentrationMl: 5,
      dosePerUnitMg: null,
      packagingUnit: "Botol 60mL",
      volumePerPackaging: 60,
    },
    {
      id: "amox_syr_250",
      drugId: "drug_amoksisilin",
      name: "Sirup Forte 250mg/5mL",
      route: "oral_sirup" as const,
      concentrationMg: 250,
      concentrationMl: 5,
      dosePerUnitMg: null,
      packagingUnit: "Botol 60mL",
      volumePerPackaging: 60,
    },
    {
      id: "amox_tab_250",
      drugId: "drug_amoksisilin",
      name: "Tablet 250mg",
      route: "oral_tablet" as const,
      concentrationMg: null,
      concentrationMl: null,
      dosePerUnitMg: 250,
      packagingUnit: null,
      volumePerPackaging: null,
    },
    {
      id: "amox_tab_500",
      drugId: "drug_amoksisilin",
      name: "Tablet 500mg",
      route: "oral_tablet" as const,
      concentrationMg: null,
      concentrationMl: null,
      dosePerUnitMg: 500,
      packagingUnit: null,
      volumePerPackaging: null,
    },

    // ── Paracetamol preparations ──
    {
      id: "pct_drop_100",
      drugId: "drug_paracetamol",
      name: "Drops 100mg/mL",
      route: "oral_sirup" as const,
      concentrationMg: 100,
      concentrationMl: 1,
      dosePerUnitMg: null,
      packagingUnit: "Botol 15mL",
      volumePerPackaging: 15,
    },
    {
      id: "pct_syr_120",
      drugId: "drug_paracetamol",
      name: "Sirup 120mg/5mL",
      route: "oral_sirup" as const,
      concentrationMg: 120,
      concentrationMl: 5,
      dosePerUnitMg: null,
      packagingUnit: "Botol 60mL",
      volumePerPackaging: 60,
    },
    {
      id: "pct_tab_500",
      drugId: "drug_paracetamol",
      name: "Tablet 500mg",
      route: "oral_tablet" as const,
      concentrationMg: null,
      concentrationMl: null,
      dosePerUnitMg: 500,
      packagingUnit: null,
      volumePerPackaging: null,
    },
    {
      id: "pct_inf_1000",
      drugId: "drug_paracetamol",
      name: "Infus 10mg/mL (1000mg/100mL)",
      route: "injeksi_iv" as const,
      concentrationMg: 10,
      concentrationMl: 1,
      dosePerUnitMg: null,
      packagingUnit: "Vial 100mL",
      volumePerPackaging: 100,
    },

    // ── Epinefrin preparations ──
    {
      id: "epi_amp_1",
      drugId: "drug_epinefrin",
      name: "Ampul 1mg/mL (1:1000)",
      route: "injeksi_im" as const,
      concentrationMg: 1,
      concentrationMl: 1,
      dosePerUnitMg: null,
      packagingUnit: "Ampul 1mL",
      volumePerPackaging: 1,
    },
    {
      id: "epi_amp_sc",
      drugId: "drug_epinefrin",
      name: "Ampul 1mg/mL (Subkutan)",
      route: "injeksi_sc" as const,
      concentrationMg: 1,
      concentrationMl: 1,
      dosePerUnitMg: null,
      packagingUnit: "Ampul 1mL",
      volumePerPackaging: 1,
    },
    {
      id: "epi_iv_10",
      drugId: "drug_epinefrin",
      name: "Spuit 1mg/10mL (1:10000)",
      route: "injeksi_iv" as const,
      concentrationMg: 1,
      concentrationMl: 10,
      dosePerUnitMg: null,
      packagingUnit: "Spuit 10mL",
      volumePerPackaging: 10,
    },
  ];

  await db
    .insert(drugPreparations)
    .values(preparationsData)
    .onConflictDoNothing();

  console.log(`  ✅ Inserted ${preparationsData.length} preparations`);

  // ──────────────────────────────────────────────────────────
  // 3. Emergency Drugs
  // ──────────────────────────────────────────────────────────
  console.log("🚨 Seeding emergency drugs...");

  const emergencyDrugsData = [
    {
      id: "emer_epinefrin",
      name: "Epinefrin (Adrenalin)",
      doseMgPerKg: 0.01,
      maxDoseMg: 1,
      minDoseMg: null,
      concentrationMg: 1,
      concentrationMl: 10,
      notes: "Berikan IV/IO secara cepat (push). Bilas dengan 5 mL NaCl 0.9%.",
      category: "Resusitasi",
      sortOrder: 1,
    },
    {
      id: "emer_amiodaron",
      name: "Amiodaron",
      doseMgPerKg: 5,
      maxDoseMg: 300,
      minDoseMg: null,
      concentrationMg: 150,
      concentrationMl: 3,
      notes: "Berikan IV/IO bolus pada VF/pVT tanpa nadi. Dapat diulang maksimal 2 kali.",
      category: "Antiaritmia",
      sortOrder: 2,
    },
    {
      id: "emer_atropin",
      name: "Atropin Sulfat",
      doseMgPerKg: 0.02,
      maxDoseMg: 0.5,
      minDoseMg: 0.1,
      concentrationMg: 0.25,
      concentrationMl: 1,
      notes: "Untuk bradikardi bergejala. Dosis minimum 0.1 mg untuk mencegah bradikardi paradoksikal.",
      category: "Antikolinergik",
      sortOrder: 3,
    },
    {
      id: "emer_dopamin",
      name: "Dopamin",
      doseMgPerKg: 0.05,
      maxDoseMg: 50,
      minDoseMg: null,
      concentrationMg: 200,
      concentrationMl: 5,
      notes: "Titasi laju infus. Gunakan vena sentral jika memungkinkan.",
      category: "Vasopresor",
      sortOrder: 4,
    },
    {
      id: "emer_lidokain",
      name: "Lidokain (Lidocaine)",
      doseMgPerKg: 1,
      maxDoseMg: 100,
      minDoseMg: null,
      concentrationMg: 20,
      concentrationMl: 1,
      notes: "Alternatif Amiodaron untuk VF/pVT.",
      category: "Antiaritmia",
      sortOrder: 5,
    },
  ];

  await db
    .insert(emergencyDrugs)
    .values(emergencyDrugsData)
    .onConflictDoNothing();

  console.log(`  ✅ Inserted ${emergencyDrugsData.length} emergency drugs`);

  // ──────────────────────────────────────────────────────────
  // Done
  // ──────────────────────────────────────────────────────────
  console.log("\n✨ Seed completed successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
