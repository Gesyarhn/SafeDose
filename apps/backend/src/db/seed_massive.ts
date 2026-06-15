import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { drugs, drugPreparations, emergencyDrugs } from './schema/index.js';
import 'dotenv/config';

const seedClient = postgres(process.env.DATABASE_URL as string, { max: 1 });
const db = drizzle(seedClient);

async function main() {
  console.log("🌱 Starting MASSIVE SafeDose seed...");

  try {
    console.log("🧹 Clearing existing data...");
    await db.delete(drugPreparations);
    await db.delete(drugs);
    await db.delete(emergencyDrugs);

    // ==========================================
    // 1. DRUGS
    // ==========================================
    const allDrugs = [
      // ANALGESIK / NSAID
      { id: "parasetamol", name: "Parasetamol", baseDoseMgPerKg: 10, frequencyPerDay: 4, type: "Analgesik / Antipiretik", indications: "Demam, Nyeri ringan-sedang", contraindications: ["Gangguan fungsi hati berat"], interactions: ["Warfarin", "Metoclopramide"], referenceSource: "IDAI 2023 / PAPDI" },
      { id: "ibuprofen", name: "Ibuprofen", baseDoseMgPerKg: 10, frequencyPerDay: 3, type: "NSAID", indications: "Nyeri inflamasi, demam tinggi", contraindications: ["Ulkus peptikum aktif", "Demam berdarah"], interactions: ["Aspirin", "Antihipertensi"], referenceSource: "IDAI 2023" },
      { id: "asam_mefenamat", name: "Asam Mefenamat", baseDoseMgPerKg: 8.3, frequencyPerDay: 3, type: "NSAID", indications: "Nyeri ringan-sedang, dismenore", contraindications: ["Ulkus peptikum", "Gangguan ginjal"], interactions: ["Antikoagulan"], referenceSource: "MIMS Indonesia" },
      { id: "ketorolac", name: "Ketorolac", baseDoseMgPerKg: 0.5, frequencyPerDay: 3, type: "NSAID Analgesik Kuat", indications: "Nyeri akut sedang-berat paska operasi", contraindications: ["Risiko perdarahan tinggi"], interactions: ["NSAID lain"], referenceSource: "MIMS Indonesia" },
      { id: "diclofenac", name: "Natrium Diklofenak", baseDoseMgPerKg: 0.8, frequencyPerDay: 2, type: "NSAID", indications: "Osteoarthritis, Rheumatoid arthritis", contraindications: ["Gagal jantung kongestif"], interactions: ["Diuretik"], referenceSource: "PAPDI / MIMS" },
      { id: "meloxicam", name: "Meloxicam", baseDoseMgPerKg: 0.25, frequencyPerDay: 1, type: "NSAID Kardioselektif COX-2", indications: "Osteoarthritis, RA", contraindications: ["Gagal ginjal berat"], interactions: ["ACE Inhibitor"], referenceSource: "PAPDI" },

      // ANTIBIOTIK
      { id: "amoksisilin", name: "Amoksisilin", baseDoseMgPerKg: 25, frequencyPerDay: 3, type: "Antibiotik • Beta-Laktam", indications: "Infeksi pernapasan, ISK", contraindications: ["Alergi penisilin"], interactions: ["Probenesid"], referenceSource: "IDAI 2023 / PAPDI" },
      { id: "cefadroxil", name: "Sefadroksil", baseDoseMgPerKg: 30, frequencyPerDay: 2, type: "Antibiotik • Sefalosporin Gen 1", indications: "Infeksi kulit, faringitis", contraindications: ["Alergi sefalosporin"], interactions: ["Aminoglikosida"], referenceSource: "IDAI 2023" },
      { id: "cefixime", name: "Sefiksim (Cefixime)", baseDoseMgPerKg: 4, frequencyPerDay: 2, type: "Antibiotik • Sefalosporin Gen 3", indications: "Demam tifoid, otitis media, GO", contraindications: ["Alergi sefalosporin"], interactions: ["Karbamazepin"], referenceSource: "PAPDI" },
      { id: "azithromycin", name: "Azitromisin", baseDoseMgPerKg: 10, frequencyPerDay: 1, type: "Antibiotik • Makrolida", indications: "Pneumonia atipikal, infeksi chlamydia", contraindications: ["Gangguan hati berat"], interactions: ["Antasida"], referenceSource: "IDAI 2023 / PAPDI" },
      { id: "ciprofloxacin", name: "Siprofloksasin", baseDoseMgPerKg: 8.3, frequencyPerDay: 2, type: "Antibiotik • Fluorokuinolon", indications: "Demam tifoid, ISK berat", contraindications: ["Anak < 18 tahun (relatif)", "Kehamilan"], interactions: ["Teofilin", "Antasida"], referenceSource: "PAPDI" },
      { id: "metronidazole", name: "Metronidazol", baseDoseMgPerKg: 8.3, frequencyPerDay: 3, type: "Antibakteri Anaerob / Antiamuba", indications: "Amubiasis, infeksi bakteri anaerob", contraindications: ["Trimester pertama kehamilan"], interactions: ["Alkohol (Reaksi disulfiram)"], referenceSource: "MIMS Indonesia" },

      // GASTROINTESTINAL
      { id: "omeprazole", name: "Omeprazole", baseDoseMgPerKg: 0.33, frequencyPerDay: 1, type: "Proton Pump Inhibitor (PPI)", indications: "GERD, Ulkus peptikum", contraindications: ["Penggunaan nelfinavir"], interactions: ["Clopidogrel"], referenceSource: "PAPDI" },
      { id: "lansoprazole", name: "Lansoprazole", baseDoseMgPerKg: 0.5, frequencyPerDay: 1, type: "Proton Pump Inhibitor (PPI)", indications: "Eradikasi H. Pylori, GERD", contraindications: [], interactions: ["Ketoconazole"], referenceSource: "PAPDI" },
      { id: "domperidone", name: "Domperidone", baseDoseMgPerKg: 0.25, frequencyPerDay: 3, type: "Antiemetik / Prokinetik", indications: "Mual, muntah", contraindications: ["Perdarahan saluran cerna"], interactions: ["Ketoconazole (QT Prolongation)"], referenceSource: "MIMS Indonesia" },
      { id: "ondansetron", name: "Ondansetron", baseDoseMgPerKg: 0.15, frequencyPerDay: 2, type: "Antiemetik • Antagonis 5-HT3", indications: "Muntah berat, kemoterapi", contraindications: ["Sindrom QT panjang bawaan"], interactions: ["Apomorphine"], referenceSource: "MIMS Indonesia" },
      { id: "sukralfat", name: "Sukralfat", baseDoseMgPerKg: 16.6, frequencyPerDay: 4, type: "Pelindung Mukosa Lambung", indications: "Ulkus gaster, gastritis akut", contraindications: ["Gagal ginjal kronis (risiko akumulasi aluminium)"], interactions: ["Tetrasiklin (hambat absorpsi)"], referenceSource: "PAPDI" },

      // KARDIOVASKULAR
      { id: "amlodipine", name: "Amlodipine", baseDoseMgPerKg: 0.08, frequencyPerDay: 1, type: "Antihipertensi • CCB", indications: "Hipertensi, Angina", contraindications: ["Hipotensi berat"], interactions: ["Simvastatin"], referenceSource: "PERKI Hipertensi" },
      { id: "captopril", name: "Captopril", baseDoseMgPerKg: 0.4, frequencyPerDay: 2, type: "Antihipertensi • ACE Inhibitor", indications: "Hipertensi, Gagal Jantung", contraindications: ["Kehamilan", "Stenosis arteri renalis bilateral"], interactions: ["Suplemen kalium"], referenceSource: "PERKI" },
      { id: "candesartan", name: "Candesartan", baseDoseMgPerKg: 0.13, frequencyPerDay: 1, type: "Antihipertensi • ARB", indications: "Hipertensi, Gagal Jantung", contraindications: ["Kehamilan trimester 2-3"], interactions: ["Lithium"], referenceSource: "PERKI" },
      { id: "bisoprolol", name: "Bisoprolol", baseDoseMgPerKg: 0.08, frequencyPerDay: 1, type: "Beta-Blocker Kardioselektif", indications: "Gagal jantung, Hipertensi", contraindications: ["Asma berat", "Blok AV derajat 2/3"], interactions: ["Verapamil"], referenceSource: "PERKI" },
      { id: "furosemide", name: "Furosemide", baseDoseMgPerKg: 0.66, frequencyPerDay: 1, type: "Diuretik Loop", indications: "Edema, Gagal Jantung Kongestif", contraindications: ["Anuria"], interactions: ["Aminoglikosida (Ototoksisitas)"], referenceSource: "PERKI" },
      { id: "atorvastatin", name: "Atorvastatin", baseDoseMgPerKg: 0.33, frequencyPerDay: 1, type: "Anti-dislipidemia • Statin", indications: "Hiperkolesterolemia, Pencegahan kardiovaskular", contraindications: ["Penyakit hati aktif", "Kehamilan"], interactions: ["Makrolida (risiko miopati)"], referenceSource: "PERKI" },

      // METABOLIK / ENDOKRIN / LAINNYA
      { id: "metformin", name: "Metformin", baseDoseMgPerKg: 8.3, frequencyPerDay: 3, type: "Antidiabetik Oral • Biguanid", indications: "Diabetes Melitus Tipe 2", contraindications: ["Gagal ginjal (eGFR <30)"], interactions: ["Kontras iodium"], referenceSource: "PERKENI" },
      { id: "glimepiride", name: "Glimepiride", baseDoseMgPerKg: 0.03, frequencyPerDay: 1, type: "Antidiabetik Oral • Sulfonilurea", indications: "Diabetes Melitus Tipe 2", contraindications: ["Ketoasidosis diabetik"], interactions: ["Beta-blocker"], referenceSource: "PERKENI" },
      { id: "allopurinol", name: "Allopurinol", baseDoseMgPerKg: 1.6, frequencyPerDay: 1, type: "Anti-Hiperurisemia", indications: "Gout arthritis kronik, Asam urat tinggi", contraindications: ["Serangan gout akut"], interactions: ["Azathioprine"], referenceSource: "PAPDI" },

      // RESPIRATORI / ALERGI
      { id: "salbutamol", name: "Salbutamol", baseDoseMgPerKg: 0.03, frequencyPerDay: 3, type: "Bronkodilator • Agonis Beta-2", indications: "Asma, PPOK", contraindications: [], interactions: ["Beta-blocker non-selektif"], referenceSource: "MIMS Indonesia" },
      { id: "cetirizine", name: "Cetirizine", baseDoseMgPerKg: 0.16, frequencyPerDay: 1, type: "Antihistamin Generasi 2", indications: "Rinitis alergi, Urtikaria", contraindications: ["Gagal ginjal berat"], interactions: ["Alkohol", "Depresan SSP"], referenceSource: "PERDOSKI" },
      { id: "dexamethasone", name: "Dexamethasone", baseDoseMgPerKg: 0.01, frequencyPerDay: 3, type: "Kortikosteroid Sistemik", indications: "Alergi berat, inflamasi, croup (anak)", contraindications: ["Infeksi jamur sistemik"], interactions: ["NSAID (risiko ulkus lambung)"], referenceSource: "MIMS Indonesia" },
      { id: "methylprednisolone", name: "Methylprednisolone", baseDoseMgPerKg: 0.06, frequencyPerDay: 2, type: "Kortikosteroid Sistemik", indications: "Penyakit autoimun, asma eksaserbasi", contraindications: ["Infeksi sistemik yang tidak diterapi"], interactions: ["Vaksin hidup"], referenceSource: "PAPDI" },
      { id: "ambroxol", name: "Ambroxol", baseDoseMgPerKg: 0.5, frequencyPerDay: 3, type: "Mukolitik", indications: "Batuk berdahak", contraindications: ["Ulkus peptikum"], interactions: ["Amoxicillin (meningkatkan penetrasi antibiotik ke paru)"], referenceSource: "MIMS Indonesia" },

      // INFEKSI JAMUR & VIRUS
      { id: "acyclovir", name: "Acyclovir", baseDoseMgPerKg: 6.6, frequencyPerDay: 5, type: "Antiviral", indications: "Herpes simplex, Varicella zoster", contraindications: ["Hipersensitivitas"], interactions: ["Probenesid"], referenceSource: "PERDOSKI" },
      { id: "ketoconazole", name: "Ketoconazole", baseDoseMgPerKg: 3.3, frequencyPerDay: 1, type: "Antijamur Sistemik", indications: "Infeksi jamur sistemik", contraindications: ["Penyakit hati akut/kronis"], interactions: ["Simvastatin", "Omeprazole"], referenceSource: "PERDOSKI / PAPDI" }
    ];

    console.log("📦 Seeding massive standard drugs list...");
    await db.insert(drugs).values(allDrugs);

    // ==========================================
    // 2. DRUG PREPARATIONS
    // ==========================================
    const allPreps = [
      // Paracetamol
      { id: "pct_syr_120", drugId: "parasetamol", name: "Sirup 120mg/5mL", route: "oral_sirup", concentrationMg: 120, concentrationMl: 5, volumePerPackaging: 60 },
      { id: "pct_drop_100", drugId: "parasetamol", name: "Drops 100mg/mL", route: "oral_sirup", concentrationMg: 100, concentrationMl: 1, volumePerPackaging: 15 },
      { id: "pct_tab_500", drugId: "parasetamol", name: "Tablet 500mg", route: "oral_tablet", dosePerUnitMg: 500 },
      // Ibuprofen
      { id: "ibu_syr_100", drugId: "ibuprofen", name: "Sirup 100mg/5mL", route: "oral_sirup", concentrationMg: 100, concentrationMl: 5, volumePerPackaging: 60 },
      { id: "ibu_tab_400", drugId: "ibuprofen", name: "Tablet 400mg", route: "oral_tablet", dosePerUnitMg: 400 },
      // Asam Mefenamat
      { id: "amef_tab_500", drugId: "asam_mefenamat", name: "Kaplet 500mg", route: "oral_tablet", dosePerUnitMg: 500 },
      // Ketorolac
      { id: "keto_inj_30", drugId: "ketorolac", name: "Injeksi 30mg/mL", route: "injeksi_iv", concentrationMg: 30, concentrationMl: 1, packagingUnit: "Ampul", volumePerPackaging: 1 },
      { id: "keto_tab_10", drugId: "ketorolac", name: "Tablet 10mg", route: "oral_tablet", dosePerUnitMg: 10 },
      // Diclofenac
      { id: "diclo_tab_50", drugId: "diclofenac", name: "Tablet 50mg", route: "oral_tablet", dosePerUnitMg: 50 },
      // Meloxicam
      { id: "melo_tab_15", drugId: "meloxicam", name: "Tablet 15mg", route: "oral_tablet", dosePerUnitMg: 15 },

      // Amoksisilin
      { id: "amox_syr_125", drugId: "amoksisilin", name: "Sirup Kering 125mg/5mL", route: "oral_sirup", concentrationMg: 125, concentrationMl: 5, volumePerPackaging: 60 },
      { id: "amox_tab_500", drugId: "amoksisilin", name: "Tablet 500mg", route: "oral_tablet", dosePerUnitMg: 500 },
      // Cefadroxil
      { id: "cefa_syr_125", drugId: "cefadroxil", name: "Sirup 125mg/5mL", route: "oral_sirup", concentrationMg: 125, concentrationMl: 5, volumePerPackaging: 60 },
      { id: "cefa_cap_500", drugId: "cefadroxil", name: "Kapsul 500mg", route: "oral_kapsul", dosePerUnitMg: 500 },
      // Cefixime
      { id: "cefix_syr_100", drugId: "cefixime", name: "Sirup Kering 100mg/5mL", route: "oral_sirup", concentrationMg: 100, concentrationMl: 5, volumePerPackaging: 30 },
      { id: "cefix_cap_200", drugId: "cefixime", name: "Kapsul 200mg", route: "oral_kapsul", dosePerUnitMg: 200 },
      // Azithromycin
      { id: "azith_syr_200", drugId: "azithromycin", name: "Sirup Kering 200mg/5mL", route: "oral_sirup", concentrationMg: 200, concentrationMl: 5, volumePerPackaging: 15 },
      { id: "azith_tab_500", drugId: "azithromycin", name: "Tablet 500mg", route: "oral_tablet", dosePerUnitMg: 500 },
      // Ciprofloxacin
      { id: "cipro_tab_500", drugId: "ciprofloxacin", name: "Tablet 500mg", route: "oral_tablet", dosePerUnitMg: 500 },
      // Metronidazole
      { id: "metro_syr_125", drugId: "metronidazole", name: "Sirup 125mg/5mL", route: "oral_sirup", concentrationMg: 125, concentrationMl: 5, volumePerPackaging: 60 },
      { id: "metro_tab_500", drugId: "metronidazole", name: "Tablet 500mg", route: "oral_tablet", dosePerUnitMg: 500 },

      // Omeprazole
      { id: "ome_cap_20", drugId: "omeprazole", name: "Kapsul 20mg", route: "oral_kapsul", dosePerUnitMg: 20 },
      { id: "ome_inj_40", drugId: "omeprazole", name: "Injeksi 40mg (Vial)", route: "injeksi_iv", concentrationMg: 40, concentrationMl: 10, packagingUnit: "Vial", volumePerPackaging: 10 },
      // Lansoprazole
      { id: "lanso_cap_30", drugId: "lansoprazole", name: "Kapsul 30mg", route: "oral_kapsul", dosePerUnitMg: 30 },
      // Domperidone
      { id: "dom_syr_5", drugId: "domperidone", name: "Sirup 5mg/5mL", route: "oral_sirup", concentrationMg: 5, concentrationMl: 5, volumePerPackaging: 60 },
      { id: "dom_tab_10", drugId: "domperidone", name: "Tablet 10mg", route: "oral_tablet", dosePerUnitMg: 10 },
      // Ondansetron
      { id: "ondan_inj_4", drugId: "ondansetron", name: "Injeksi 4mg/2mL", route: "injeksi_iv", concentrationMg: 4, concentrationMl: 2, packagingUnit: "Ampul", volumePerPackaging: 2 },
      { id: "ondan_tab_4", drugId: "ondansetron", name: "Tablet 4mg", route: "oral_tablet", dosePerUnitMg: 4 },
      // Sukralfat
      { id: "sukra_syr_500", drugId: "sukralfat", name: "Suspensi 500mg/5mL", route: "oral_sirup", concentrationMg: 500, concentrationMl: 5, volumePerPackaging: 100 },

      // Amlodipine
      { id: "amlo_tab_5", drugId: "amlodipine", name: "Tablet 5mg", route: "oral_tablet", dosePerUnitMg: 5 },
      { id: "amlo_tab_10", drugId: "amlodipine", name: "Tablet 10mg", route: "oral_tablet", dosePerUnitMg: 10 },
      // Captopril
      { id: "cap_tab_125", drugId: "captopril", name: "Tablet 12.5mg", route: "oral_tablet", dosePerUnitMg: 12.5 },
      { id: "cap_tab_25", drugId: "captopril", name: "Tablet 25mg", route: "oral_tablet", dosePerUnitMg: 25 },
      // Candesartan
      { id: "cande_tab_8", drugId: "candesartan", name: "Tablet 8mg", route: "oral_tablet", dosePerUnitMg: 8 },
      { id: "cande_tab_16", drugId: "candesartan", name: "Tablet 16mg", route: "oral_tablet", dosePerUnitMg: 16 },
      // Bisoprolol
      { id: "biso_tab_5", drugId: "bisoprolol", name: "Tablet 5mg", route: "oral_tablet", dosePerUnitMg: 5 },
      // Furosemide
      { id: "furo_tab_40", drugId: "furosemide", name: "Tablet 40mg", route: "oral_tablet", dosePerUnitMg: 40 },
      { id: "furo_inj_20", drugId: "furosemide", name: "Injeksi 20mg/2mL", route: "injeksi_iv", concentrationMg: 20, concentrationMl: 2, packagingUnit: "Ampul", volumePerPackaging: 2 },
      // Atorvastatin
      { id: "ator_tab_20", drugId: "atorvastatin", name: "Tablet 20mg", route: "oral_tablet", dosePerUnitMg: 20 },

      // Metformin
      { id: "met_tab_500", drugId: "metformin", name: "Tablet 500mg", route: "oral_tablet", dosePerUnitMg: 500 },
      // Glimepiride
      { id: "glim_tab_2", drugId: "glimepiride", name: "Tablet 2mg", route: "oral_tablet", dosePerUnitMg: 2 },
      // Allopurinol
      { id: "allo_tab_100", drugId: "allopurinol", name: "Tablet 100mg", route: "oral_tablet", dosePerUnitMg: 100 },

      // Salbutamol
      { id: "salbu_syr_2", drugId: "salbutamol", name: "Sirup 2mg/5mL", route: "oral_sirup", concentrationMg: 2, concentrationMl: 5, volumePerPackaging: 60 },
      { id: "salbu_tab_2", drugId: "salbutamol", name: "Tablet 2mg", route: "oral_tablet", dosePerUnitMg: 2 },
      // Cetirizine
      { id: "ceti_tab_10", drugId: "cetirizine", name: "Tablet 10mg", route: "oral_tablet", dosePerUnitMg: 10 },
      { id: "ceti_syr_5", drugId: "cetirizine", name: "Sirup 5mg/5mL", route: "oral_sirup", concentrationMg: 5, concentrationMl: 5, volumePerPackaging: 60 },
      // Dexamethasone
      { id: "dexa_tab_05", drugId: "dexamethasone", name: "Tablet 0.5mg", route: "oral_tablet", dosePerUnitMg: 0.5 },
      { id: "dexa_inj_5", drugId: "dexamethasone", name: "Injeksi 5mg/mL", route: "injeksi_iv", concentrationMg: 5, concentrationMl: 1, packagingUnit: "Ampul", volumePerPackaging: 1 },
      // Methylprednisolone
      { id: "meth_tab_4", drugId: "methylprednisolone", name: "Tablet 4mg", route: "oral_tablet", dosePerUnitMg: 4 },
      { id: "meth_tab_16", drugId: "methylprednisolone", name: "Tablet 16mg", route: "oral_tablet", dosePerUnitMg: 16 },
      // Ambroxol
      { id: "ambrox_syr_15", drugId: "ambroxol", name: "Sirup 15mg/5mL", route: "oral_sirup", concentrationMg: 15, concentrationMl: 5, volumePerPackaging: 60 },
      { id: "ambrox_tab_30", drugId: "ambroxol", name: "Tablet 30mg", route: "oral_tablet", dosePerUnitMg: 30 },

      // Acyclovir
      { id: "acy_tab_400", drugId: "acyclovir", name: "Tablet 400mg", route: "oral_tablet", dosePerUnitMg: 400 },
      // Ketoconazole
      { id: "keto_tab_200", drugId: "ketoconazole", name: "Tablet 200mg", route: "oral_tablet", dosePerUnitMg: 200 },
    ];

    console.log("💊 Seeding massive drug preparations...");
    await db.insert(drugPreparations).values(allPreps as any);

    // ==========================================
    // 3. EMERGENCY DRUGS (IGD)
    // ==========================================
    const emDrugs = [
      { id: "epinefrin_igd", name: "Epinefrin (Adrenalin)", doseMgPerKg: 0.01, maxDoseMg: 1, minDoseMg: 0.1, concentrationMg: 1, concentrationMl: 1, notes: "Dosis ACLS henti jantung (1mg IV setiap 3-5 menit). PALS pediatrik 0.01 mg/kgBB. Flush dengan 20mL NS.", category: "Henti Jantung / Resusitasi", sortOrder: 1 },
      { id: "amiodaron_igd", name: "Amiodaron", doseMgPerKg: 5, maxDoseMg: 300, concentrationMg: 150, concentrationMl: 3, notes: "Untuk VF/pVT tanpa nadi. Dosis pertama dewasa 300mg bolus, dosis kedua 150mg.", category: "Anti-Aritmia", sortOrder: 2 },
      { id: "atropin_igd", name: "Atropin Sulfat", doseMgPerKg: 0.02, maxDoseMg: 0.5, minDoseMg: 0.1, concentrationMg: 0.25, concentrationMl: 1, notes: "Bradikardia simptomatik. Dewasa 1mg IV setiap 3-5 menit (maks 3mg).", category: "Bradikardia", sortOrder: 3 },
      { id: "dopamin_igd", name: "Dopamin", doseMgPerKg: 5, maxDoseMg: 20, concentrationMg: 200, concentrationMl: 5, notes: "Infus kontinu 2-20 mcg/kg/menit. Titrasi sesuai respon tekanan darah. Waspada takiaritmia.", category: "Inotropik / Vasopresor", sortOrder: 4 },
      { id: "dobutamin_igd", name: "Dobutamin", doseMgPerKg: 2, maxDoseMg: 20, concentrationMg: 250, concentrationMl: 5, notes: "Infus kontinu 2-20 mcg/kg/menit. Digunakan untuk syok kardiogenik dengan TD sistolik > 70 mmHg.", category: "Inotropik", sortOrder: 5 },
      { id: "MgSO4_igd", name: "Magnesium Sulfat 20%", doseMgPerKg: 25, maxDoseMg: 2000, concentrationMg: 200, concentrationMl: 1, notes: "Torsades de Pointes atau Asma Eksaserbasi Berat. Dewasa 1-2 gram dilarutkan dalam 10mL D5W bolus lambat.", category: "Anti-Aritmia / Eklampsia", sortOrder: 6 },
      { id: "lidokain_igd", name: "Lidokain 2%", doseMgPerKg: 1, maxDoseMg: 100, concentrationMg: 20, concentrationMl: 1, notes: "Alternatif amiodaron untuk VF/pVT. Dosis awal 1-1.5 mg/kg IV/IO.", category: "Anti-Aritmia", sortOrder: 7 },
      { id: "kalsium_glukonas_igd", name: "Kalsium Glukonas 10%", doseMgPerKg: 60, maxDoseMg: 3000, concentrationMg: 100, concentrationMl: 1, notes: "Hiperkalemia berat, hipokalsemia simptomatik. Berikan lambat IV.", category: "Elektrolit", sortOrder: 8 },
      { id: "nalokson_igd", name: "Nalokson", doseMgPerKg: 0.01, maxDoseMg: 2, minDoseMg: 0.1, concentrationMg: 0.4, concentrationMl: 1, notes: "Intoksikasi opioid. Dapat diulang setiap 2-3 menit sesuai respon klinis.", category: "Antidotum", sortOrder: 9 },
      { id: "diazepam_igd", name: "Diazepam", doseMgPerKg: 0.1, maxDoseMg: 10, concentrationMg: 10, concentrationMl: 2, notes: "Status epileptikus, kejang akut. Berikan IV lambat.", category: "Anti-konvulsan", sortOrder: 10 }
    ];

    console.log("🚨 Seeding massive emergency drugs...");
    await db.insert(emergencyDrugs).values(emDrugs as any);

    console.log("✨ Massive Seed completed successfully!");

  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await seedClient.end();
  }
}

main();
