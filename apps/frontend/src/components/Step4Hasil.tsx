import React, { useState } from 'react';
import type { PatientData, DrugData, ParameterData } from '../types';

interface Step4HasilProps {
  patient: PatientData;
  drug: DrugData;
  parameter: ParameterData;
  onRestart: () => void;
}

const formatNumber = (num: number) => Number.isInteger(num) ? num : num.toFixed(2);

const Step4Hasil: React.FC<Step4HasilProps> = ({ patient, drug, parameter, onRestart }) => {
  const [duration, setDuration] = useState<number>(7);
  
  const prep = drug.preparations.find(p => p.id === parameter.preparationId) || drug.preparations[0];
  const isSirup = prep.route === 'oral_sirup';
  const isTablet = prep.route.includes('tablet') || prep.route.includes('kapsul');
  const isInjeksi = prep.route.includes('injeksi');

  // Base Calculation (Mg)
  const totalDailyDoseMg = patient.weight * parameter.doseMgPerKg;
  const dosePerAdminMg = totalDailyDoseMg / parameter.frequency;

  // Variables for specific routes
  let adminPrimaryValue = '';
  let adminSecondaryValue = '';
  let totalSupplyText = '';
  let spoonText = '';
  let formulaLines: string[] = [];
  let bpjsWarning: React.ReactNode = null;

  formulaLines.push(`1. Dosis Mg = ${parameter.doseMgPerKg} mg/kg × ${patient.weight} kg = ${formatNumber(totalDailyDoseMg)} mg/hari`);
  formulaLines.push(`2. Dosis per kali = ${formatNumber(totalDailyDoseMg)} mg / ${parameter.frequency}x = ${formatNumber(dosePerAdminMg)} mg`);

  if (isSirup || isInjeksi) {
    const dosePerAdminMl = (dosePerAdminMg / (prep.concentrationMg || 1)) * (prep.concentrationMl || 1);
    const totalDailyMl = dosePerAdminMl * parameter.frequency;
    const totalTherapyMl = duration > 0 ? duration * totalDailyMl : 0;
    
    adminPrimaryValue = `${formatNumber(dosePerAdminMl)} mL`;
    adminSecondaryValue = `${formatNumber(dosePerAdminMg)} mg`;
    
    formulaLines.push(`3. Volume per kali = (${formatNumber(dosePerAdminMg)} / ${prep.concentrationMg}) × ${prep.concentrationMl} mL = ${formatNumber(dosePerAdminMl)} mL`);
    formulaLines.push(`4. Total Harian = ${formatNumber(dosePerAdminMl)} mL × ${parameter.frequency} = ${formatNumber(totalDailyMl)} mL/hari`);
    formulaLines.push(`5. Total Terapi = ${formatNumber(totalDailyMl)} mL × ${duration} hari = ${formatNumber(totalTherapyMl)} mL`);

    if (isSirup) {
      const volPerBotol = prep.volumePerPackaging || 60;
      const bottles = Math.ceil(totalTherapyMl / volPerBotol);
      totalSupplyText = `${bottles} Botol (@${volPerBotol}mL)`;
      formulaLines.push(`6. Jumlah Botol = ceil(${formatNumber(totalTherapyMl)} / ${volPerBotol}) = ${bottles} Botol`);
      
      // Spoon Logic Dual Display (Always show both C and cth)
      spoonText = `${formatNumber(dosePerAdminMl / 15)} C (Sendok Makan) atau ${formatNumber(dosePerAdminMl / 5)} cth (Sendok Teh)`;

      // BPJS Fallback Logic
      if (bottles > 1) {
        const missingMl = totalTherapyMl - volPerBotol;
        const missingMg = (missingMl / (prep.concentrationMl || 1)) * (prep.concentrationMg || 1);
        
        // Find tablet alternative
        const tabletAlt = drug.preparations.find(p => p.route.includes('tablet'));
        
        bpjsWarning = (
          <div className="mt-6 bg-tertiary-container/10 border border-tertiary/20 rounded-xl p-4 flex gap-4 items-start">
            <span className="material-symbols-outlined text-tertiary">health_and_safety</span>
            <div className="space-y-1">
              <h4 className="font-bold text-on-surface">Informasi Peresepan BPJS</h4>
              <p className="text-body-sm text-on-surface-variant">
                Maksimal cover BPJS untuk sediaan sirup umumnya adalah <strong>1 botol</strong> per resep.
              </p>
              {tabletAlt ? (
                <div className="mt-2 p-3 bg-error/10 border border-error/20 rounded-lg space-y-2">
                  <p className="text-body-sm text-error font-bold">
                    Sisa kebutuhan {bottles - 1} Botol tidak tercover BPJS.
                  </p>
                  <div className="text-body-sm text-on-surface-variant space-y-1">
                    <p><strong>Opsi 1:</strong> Pasien menebus sisa {bottles - 1} botol secara mandiri (non-BPJS).</p>
                    <p><strong>Opsi 2:</strong> Kekurangan dosis ({formatNumber(missingMg)} mg). Dibutuhkan <strong>{Math.ceil(missingMg / (tabletAlt.dosePerUnitMg || 1))} Tablet</strong> {tabletAlt.name} untuk digerus.</p>
                  </div>
                </div>
              ) : (
                <div className="mt-2 p-3 bg-error/10 border border-error/20 rounded-lg">
                  <p className="text-body-sm text-error font-bold mb-1">
                    Sisa kebutuhan {bottles - 1} Botol tidak tercover BPJS.
                  </p>
                  <p className="text-body-sm text-on-surface-variant">
                    Pasien dapat menebus sisa botol secara mandiri (non-BPJS).
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      }
    } else {
      // Injeksi
      const volPerAmpul = prep.volumePerPackaging || 1;
      const ampuls = Math.ceil(totalTherapyMl / volPerAmpul);
      totalSupplyText = `${ampuls} ${prep.packagingUnit || 'Ampul'}`;
      formulaLines.push(`6. Kebutuhan = ceil(${formatNumber(totalTherapyMl)} / ${volPerAmpul}) = ${ampuls} ${prep.packagingUnit || 'Ampul'}`);
    }

  } else if (isTablet) {
    const tabletPerAdmin = dosePerAdminMg / (prep.dosePerUnitMg || 1);
    const totalDailyTabs = tabletPerAdmin * parameter.frequency;
    const totalTherapyTabs = duration > 0 ? duration * totalDailyTabs : 0;
    
    adminPrimaryValue = `${formatNumber(tabletPerAdmin)} Tablet`;
    adminSecondaryValue = `${formatNumber(dosePerAdminMg)} mg`;
    totalSupplyText = `${Math.ceil(totalTherapyTabs)} Tablet`;
    
    formulaLines.push(`3. Jumlah Tablet per kali = ${formatNumber(dosePerAdminMg)} mg / ${prep.dosePerUnitMg} mg = ${formatNumber(tabletPerAdmin)} Tab`);
    formulaLines.push(`4. Total Terapi = ${formatNumber(tabletPerAdmin)} × ${parameter.frequency} × ${duration} hari = ${formatNumber(totalTherapyTabs)} Tab`);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left Column: Primary Result Content */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full ring-1 ring-secondary/20">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="text-label-caps font-label-caps">● DOSIS AMAN</span>
              </div>
              <span className="text-body-sm text-on-surface-variant italic">Rute: {prep.route.replace('oral_', 'Oral ').replace('injeksi_', 'Injeksi ').toUpperCase()}</span>
            </div>
            
            <h1 className="text-headline-md font-headline-md text-on-surface mb-6">{drug.name} — {prep.name}</h1>
            
            <div className="bg-surface-container-low rounded-xl p-6 border-l-4 border-primary">
              <div className="space-y-6">
                <div>
                  <p className="text-label-caps font-label-caps text-on-surface-variant mb-2">DOSIS PER PEMBERIAN</p>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-dosage-display font-dosage-display text-primary">{adminPrimaryValue}</span>
                    <span className="text-headline-sm font-headline-sm text-on-surface-variant">=</span>
                    <span className="text-headline-md font-headline-md text-secondary">{adminSecondaryValue}</span>
                  </div>
                  {isSirup && spoonText && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-secondary-container/30 text-on-secondary-container px-3 py-2 rounded-lg border border-secondary/20">
                      <span className="material-symbols-outlined text-sm">soup_kitchen</span>
                      <span className="font-bold text-sm">Takaran: {spoonText}</span>
                    </div>
                  )}
                  {isInjeksi && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-error-container/30 text-on-error-container px-3 py-2 rounded-lg border border-error/20">
                      <span className="material-symbols-outlined text-sm">syringe</span>
                      <span className="font-bold text-sm">Laju / Cara: Disesuaikan dengan pedoman injeksi spesifik.</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-outline-variant/30">
                  <div>
                    <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">FREKUENSI</p>
                    <p className="text-headline-sm font-headline-sm text-on-surface">{parameter.frequency}× sehari</p>
                  </div>
                  <div>
                    <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">DOSIS HARIAN TOTAL</p>
                    <p className="text-headline-sm font-headline-sm text-on-surface dosage-mono">{formatNumber(totalDailyDoseMg)} mg</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Supply Calculation */}
            <div className="mt-8 pt-8 border-t border-outline-variant">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2" htmlFor="duration">DURASI TERAPI (HARI)</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-surface border-outline rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary focus:border-transparent text-headline-sm font-headline-sm dosage-mono" 
                      id="duration" 
                      type="number" 
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">Hari</span>
                  </div>
                </div>
                <div className="flex flex-col justify-end">
                  <p className="text-label-caps font-label-caps text-on-surface-variant mb-2">ESTIMASI KEBUTUHAN OBAT</p>
                  <div className="bg-surface-container-highest rounded-lg px-4 py-3 flex items-center justify-between">
                    <span className="font-bold text-on-surface">{totalSupplyText}</span>
                  </div>
                </div>
              </div>
            </div>

            {bpjsWarning}

            {/* Formula Accordion */}
            <div className="mt-8">
              <details className="group border border-outline-variant rounded-lg bg-surface">
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">function</span>
                    <span className="font-bold text-on-surface">Lihat Formula Kalkulasi</span>
                  </div>
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="p-4 pt-0 text-body-md text-on-surface-variant dosage-mono text-sm space-y-2 border-t border-outline-variant/30 overflow-x-auto">
                  {formulaLines.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </details>
            </div>
          </div>

          <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">menu_book</span>
              <span className="text-label-caps font-label-caps">REFERENSI: IDAI 2023, BNF 84</span>
            </div>
            <span className="text-xs text-on-surface-variant opacity-70">Terverifikasi Clinical Pharmacist</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined">picture_as_pdf</span>
            Ekspor PDF
          </button>
          <button 
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-6 text-on-surface-variant hover:text-primary transition-colors font-medium border-2 border-outline rounded-xl"
            onClick={onRestart}
          >
            <span className="material-symbols-outlined">refresh</span>
            Hitung Ulang
          </button>
        </div>
      </div>

      {/* Right Column: Sidebar References */}
      <aside className="lg:col-span-4 space-y-6">
        <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
          <h3 className="font-bold text-headline-sm mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">lightbulb</span>
            Instruksi Pemberian
          </h3>
          <ul className="space-y-4">
            {isSirup && (
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-secondary shrink-0">info</span>
                <p className="text-body-sm text-on-surface-variant">Kocok dahulu sebelum digunakan untuk memastikan suspensi homogen.</p>
              </li>
            )}
            {isTablet && (
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-secondary shrink-0">info</span>
                <p className="text-body-sm text-on-surface-variant">Tablet dapat digerus atau dibelah sesuai garis potong (bila ada) untuk menyesuaikan dosis anak.</p>
              </li>
            )}
            {isInjeksi && (
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-error shrink-0">warning</span>
                <p className="text-body-sm font-semibold">Injeksi harus dilakukan oleh tenaga medis profesional dengan teknik aseptik yang ketat.</p>
              </li>
            )}
            <li className="flex gap-3 text-error">
              <span className="material-symbols-outlined shrink-0">warning</span>
              <p className="text-body-sm font-semibold">Hentikan penggunaan jika muncul ruam kulit atau tanda hipersensitivitas.</p>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Step4Hasil;
