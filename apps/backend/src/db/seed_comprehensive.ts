import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { drugs, drugPreparations, emergencyDrugs } from './schema/index.js';
import 'dotenv/config';

const seedClient = postgres(process.env.DATABASE_URL as string, { max: 1 });
const db = drizzle(seedClient);

async function main() {
  console.log("🌱 Starting Comprehensive SafeDose seed...");

  try {
    // Clear existing data to avoid conflicts
    console.log("🧹 Clearing existing data...");
    await db.delete(drugPreparations);
    await db.delete(drugs);
    await db.delete(emergencyDrugs);

    // 1. IDAI (Pediatrik)
    const idaiDrugs = [
      {
        id: "parasetamol_idai",
        name: "Parasetamol",
        baseDoseMgPerKg: 10,
        frequencyPerDay: 4,
        type: "Analgesik / Antipiretik",
        indications: "Demam, Nyeri ringan-sedang",
        contraindications: ["Gangguan fungsi hati berat"],
        interactions: ["Warfarin", "Metoclopramide"],
        referenceSource: "Buku Saku IDAI 2023",
      },
      {
        id: "amoksisilin_idai",
        name: "Amoksisilin (Amoxicillin)",
        baseDoseMgPerKg: 25,
        frequencyPerDay: 3,
        type: "Antibiotik • Golongan Beta-Laktam",
        indications: "Infeksi saluran napas, otitis media, infeksi saluran kemih",
        contraindications: ["Hipersensitivitas penisilin"],
        interactions: ["Allopurinol", "Probenesid"],
        referenceSource: "Buku Saku IDAI 2023",
      },
      {
        id: "cefadroxil_idai",
        name: "Sefadroksil (Cefadroxil)",
        baseDoseMgPerKg: 30, // 30 mg/kgBB/hari dibagi 2
        frequencyPerDay: 2,
        type: "Antibiotik • Sefalosporin Generasi 1",
        indications: "Infeksi kulit, faringitis streptokokus",
        contraindications: ["Alergi sefalosporin"],
        interactions: ["Aminoglikosida"],
        referenceSource: "Buku Saku IDAI 2023",
      },
      {
        id: "ibuprofen_idai",
        name: "Ibuprofen",
        baseDoseMgPerKg: 10, // 10 mg/kgBB/kali
        frequencyPerDay: 3,
        type: "NSAID",
        indications: "Nyeri inflamasi, demam tinggi",
        contraindications: ["Ulkus peptikum aktif", "Demam berdarah (suspek)"],
        interactions: ["Aspirin", "Antihipertensi"],
        referenceSource: "Buku Saku IDAI 2023",
      }
    ];

    // 2. PERKENI (Diabetes)
    const perkeniDrugs = [
      {
        id: "metformin_perkeni",
        name: "Metformin",
        baseDoseMgPerKg: 8.3, // e.g. 500mg for 60kg adult
        frequencyPerDay: 3,
        type: "Antidiabetik Oral • Biguanid",
        indications: "Diabetes Melitus Tipe 2",
        contraindications: ["Gagal ginjal (eGFR <30)", "Asidosis metabolik"],
        interactions: ["Kontras iodium", "Alkohol"],
        referenceSource: "Pedoman PERKENI 2021",
      },
      {
        id: "glimepiride_perkeni",
        name: "Glimepiride",
        baseDoseMgPerKg: 0.03, // 1-2mg for 60kg
        frequencyPerDay: 1,
        type: "Antidiabetik Oral • Sulfonilurea",
        indications: "Diabetes Melitus Tipe 2",
        contraindications: ["Ketoasidosis diabetik", "Kerusakan hati berat"],
        interactions: ["Beta-blocker", "Flukonazol"],
        referenceSource: "Pedoman PERKENI 2021",
      }
    ];

    // 3. PAPDI (Penyakit Dalam)
    const papdiDrugs = [
      {
        id: "omeprazole_papdi",
        name: "Omeprazole",
        baseDoseMgPerKg: 0.33, // 20mg for 60kg
        frequencyPerDay: 1,
        type: "PPI (Proton Pump Inhibitor)",
        indications: "GERD, Ulkus peptikum",
        contraindications: ["Penggunaan bersama nelfinavir"],
        interactions: ["Clopidogrel", "Digoxin"],
        referenceSource: "Pedoman PAPDI",
      },
      {
        id: "allopurinol_papdi",
        name: "Allopurinol",
        baseDoseMgPerKg: 1.6, // 100mg for 60kg
        frequencyPerDay: 1,
        type: "Penghambat Xanthine Oxidase",
        indications: "Gout arthritis kronik, Hiperurisemia",
        contraindications: ["Serangan gout akut"],
        interactions: ["Azathioprine", "Amoxicillin (ruam)"],
        referenceSource: "Pedoman PAPDI",
      }
    ];

    // 4. PERKI (Kardiovaskular)
    const perkiDrugs = [
      {
        id: "amlodipine_perki",
        name: "Amlodipine",
        baseDoseMgPerKg: 0.08, // 5mg for 60kg
        frequencyPerDay: 1,
        type: "Calcium Channel Blocker (CCB)",
        indications: "Hipertensi, Angina",
        contraindications: ["Hipotensi berat", "Syok kardiogenik"],
        interactions: ["Simvastatin", "Ketoconazole"],
        referenceSource: "Pedoman PERKI Hipertensi",
      },
      {
        id: "bisoprolol_perki",
        name: "Bisoprolol",
        baseDoseMgPerKg: 0.08, // 5mg for 60kg
        frequencyPerDay: 1,
        type: "Beta-Blocker Kardioselektif",
        indications: "Hipertensi, Gagal Jantung",
        contraindications: ["Asma berat", "Blok AV derajat 2/3"],
        interactions: ["Verapamil", "Diltiazem"],
        referenceSource: "Pedoman PERKI Gagal Jantung",
      }
    ];

    // 5. PERDOSKI (Kulit & Kelamin)
    const perdoskiDrugs = [
      {
        id: "cetirizine_perdoski",
        name: "Cetirizine",
        baseDoseMgPerKg: 0.16, // 10mg for 60kg
        frequencyPerDay: 1,
        type: "Antihistamin Generasi 2",
        indications: "Rinitis alergi, Urtikaria",
        contraindications: ["Gagal ginjal berat"],
        interactions: ["Depresan SSP", "Alkohol"],
        referenceSource: "Pedoman PERDOSKI",
      },
      {
        id: "acyclovir_perdoski",
        name: "Acyclovir",
        baseDoseMgPerKg: 6.6, // 400mg for 60kg
        frequencyPerDay: 5,
        type: "Antiviral",
        indications: "Herpes simplex, Varicella zoster",
        contraindications: ["Hipersensitivitas acyclovir"],
        interactions: ["Probenesid"],
        referenceSource: "Pedoman PERDOSKI",
      }
    ];

    const allStandardDrugs = [...idaiDrugs, ...perkeniDrugs, ...papdiDrugs, ...perkiDrugs, ...perdoskiDrugs];

    console.log("📦 Seeding standard drugs...");
    await db.insert(drugs).values(allStandardDrugs);
    console.log(`  ✅ Inserted ${allStandardDrugs.length} standard drugs`);

    const prepsToInsert: any[] = [];
    
    // Preparations IDAI
    prepsToInsert.push(
      { id: "pct_syr_120", drugId: "parasetamol_idai", name: "Sirup 120mg/5mL", route: "oral_sirup", concentrationMg: 120, concentrationMl: 5, volumePerPackaging: 60 },
      { id: "pct_drop_100", drugId: "parasetamol_idai", name: "Drops 100mg/mL", route: "oral_sirup", concentrationMg: 100, concentrationMl: 1, volumePerPackaging: 15 },
      { id: "pct_tab_500", drugId: "parasetamol_idai", name: "Tablet 500mg", route: "oral_tablet", dosePerUnitMg: 500 },
      { id: "amox_syr_125", drugId: "amoksisilin_idai", name: "Sirup Kering 125mg/5mL", route: "oral_sirup", concentrationMg: 125, concentrationMl: 5, volumePerPackaging: 60 },
      { id: "amox_syr_250", drugId: "amoksisilin_idai", name: "Sirup Kering 250mg/5mL", route: "oral_sirup", concentrationMg: 250, concentrationMl: 5, volumePerPackaging: 60 },
      { id: "amox_tab_500", drugId: "amoksisilin_idai", name: "Tablet 500mg", route: "oral_tablet", dosePerUnitMg: 500 },
      { id: "cefa_syr_125", drugId: "cefadroxil_idai", name: "Sirup Kering 125mg/5mL", route: "oral_sirup", concentrationMg: 125, concentrationMl: 5, volumePerPackaging: 60 },
      { id: "cefa_cap_500", drugId: "cefadroxil_idai", name: "Kapsul 500mg", route: "oral_kapsul", dosePerUnitMg: 500 },
      { id: "ibu_syr_100", drugId: "ibuprofen_idai", name: "Sirup 100mg/5mL", route: "oral_sirup", concentrationMg: 100, concentrationMl: 5, volumePerPackaging: 60 },
      { id: "ibu_tab_400", drugId: "ibuprofen_idai", name: "Tablet 400mg", route: "oral_tablet", dosePerUnitMg: 400 }
    );

    // Preparations PERKENI
    prepsToInsert.push(
      { id: "met_tab_500", drugId: "metformin_perkeni", name: "Tablet 500mg", route: "oral_tablet", dosePerUnitMg: 500 },
      { id: "met_tab_850", drugId: "metformin_perkeni", name: "Tablet 850mg", route: "oral_tablet", dosePerUnitMg: 850 },
      { id: "glim_tab_2", drugId: "glimepiride_perkeni", name: "Tablet 2mg", route: "oral_tablet", dosePerUnitMg: 2 },
      { id: "glim_tab_4", drugId: "glimepiride_perkeni", name: "Tablet 4mg", route: "oral_tablet", dosePerUnitMg: 4 }
    );

    // Preparations PAPDI
    prepsToInsert.push(
      { id: "ome_cap_20", drugId: "omeprazole_papdi", name: "Kapsul 20mg", route: "oral_kapsul", dosePerUnitMg: 20 },
      { id: "allo_tab_100", drugId: "allopurinol_papdi", name: "Tablet 100mg", route: "oral_tablet", dosePerUnitMg: 100 },
      { id: "allo_tab_300", drugId: "allopurinol_papdi", name: "Tablet 300mg", route: "oral_tablet", dosePerUnitMg: 300 }
    );

    // Preparations PERKI
    prepsToInsert.push(
      { id: "amlo_tab_5", drugId: "amlodipine_perki", name: "Tablet 5mg", route: "oral_tablet", dosePerUnitMg: 5 },
      { id: "amlo_tab_10", drugId: "amlodipine_perki", name: "Tablet 10mg", route: "oral_tablet", dosePerUnitMg: 10 },
      { id: "biso_tab_5", drugId: "bisoprolol_perki", name: "Tablet 5mg", route: "oral_tablet", dosePerUnitMg: 5 }
    );

    // Preparations PERDOSKI
    prepsToInsert.push(
      { id: "ceti_tab_10", drugId: "cetirizine_perdoski", name: "Tablet 10mg", route: "oral_tablet", dosePerUnitMg: 10 },
      { id: "ceti_syr_5", drugId: "cetirizine_perdoski", name: "Sirup 5mg/5mL", route: "oral_sirup", concentrationMg: 5, concentrationMl: 5, volumePerPackaging: 60 },
      { id: "acy_tab_400", drugId: "acyclovir_perdoski", name: "Tablet 400mg", route: "oral_tablet", dosePerUnitMg: 400 }
    );

    console.log("💊 Seeding drug preparations...");
    await db.insert(drugPreparations).values(prepsToInsert);
    console.log(`  ✅ Inserted ${prepsToInsert.length} preparations`);

    // 6. IGD (Emergency Drugs - ACLS/PALS)
    const emDrugs = [
      {
        id: "epinefrin_igd",
        name: "Epinefrin (Adrenalin)",
        doseMgPerKg: 0.01,
        maxDoseMg: 1,
        minDoseMg: 0.1,
        concentrationMg: 1,
        concentrationMl: 1,
        notes: "Dosis ACLS henti jantung (1mg IV setiap 3-5 menit). PALS pediatrik 0.01 mg/kgBB. Flush dengan 20mL NS.",
        category: "Henti Jantung / Resusitasi",
        sortOrder: 1,
      },
      {
        id: "amiodaron_igd",
        name: "Amiodaron",
        doseMgPerKg: 5,
        maxDoseMg: 300,
        concentrationMg: 150,
        concentrationMl: 3,
        notes: "Untuk VF/pVT tanpa nadi. Dosis pertama dewasa 300mg bolus, dosis kedua 150mg. Pediatrik 5 mg/kgBB.",
        category: "Anti-Aritmia",
        sortOrder: 2,
      },
      {
        id: "atropin_igd",
        name: "Atropin Sulfat",
        doseMgPerKg: 0.02,
        maxDoseMg: 0.5, // Dewasa 1mg
        minDoseMg: 0.1,
        concentrationMg: 0.25,
        concentrationMl: 1,
        notes: "Bradikardia simptomatik. Dewasa 1mg IV setiap 3-5 menit (maks 3mg).",
        category: "Bradikardia",
        sortOrder: 3,
      },
      {
        id: "dopamin_igd",
        name: "Dopamin",
        doseMgPerKg: 5, // mcg/kg/min -> we will store base reference
        maxDoseMg: 20,
        concentrationMg: 200,
        concentrationMl: 5,
        notes: "Infus kontinu 2-20 mcg/kg/menit. Titrasi sesuai respon tekanan darah. Waspada takiaritmia.",
        category: "Inotropik / Vasopresor",
        sortOrder: 4,
      },
      {
        id: "MgSO4_igd",
        name: "Magnesium Sulfat 20%",
        doseMgPerKg: 25, // 25-50 mg/kg
        maxDoseMg: 2000,
        concentrationMg: 200, // 20% = 200mg/mL
        concentrationMl: 1,
        notes: "Torsades de Pointes atau Asma Eksaserbasi Berat (PALS). Dewasa 1-2 gram dilarutkan dalam 10mL D5W bolus lambat (POGI Eklampsia).",
        category: "Anti-Aritmia / Eklampsia",
        sortOrder: 5,
      }
    ];

    console.log("🚨 Seeding emergency drugs (PALS/ACLS/POGI)...");
    await db.insert(emergencyDrugs).values(emDrugs);
    console.log(`  ✅ Inserted ${emDrugs.length} emergency drugs`);

    console.log("✨ Comprehensive Seed completed successfully!");

  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await seedClient.end();
  }
}

main();
