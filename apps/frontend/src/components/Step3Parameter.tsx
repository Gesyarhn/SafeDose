import React, { useEffect } from 'react';
import type { DrugData, PatientData } from '../types';

import type { ParameterData } from '../types';

interface Step3ParameterProps {
  patient: PatientData;
  drug: DrugData;
  parameter: ParameterData;
  setParameter: (p: ParameterData) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step3Parameter: React.FC<Step3ParameterProps> = ({ patient, drug, parameter, setParameter, onNext, onBack }) => {

  // Find the selected preparation object
  const selectedPrep = drug.preparations.find(p => p.id === parameter.preparationId) || drug.preparations[0];

  // Auto-select first prep if not set
  useEffect(() => {
    if (!parameter.preparationId && drug.preparations.length > 0) {
      setParameter({ ...parameter, preparationId: drug.preparations[0].id });
    }
  }, [drug, parameter, setParameter]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
      {/* Left Column */}
      <div className="lg:col-span-8 space-y-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-sm">
          <h1 className="text-headline-md font-headline-md text-on-surface uppercase tracking-tight">PARAMETER DOSIS</h1>
          <p className="text-body-md text-on-surface-variant">Konfirmasi atau sesuaikan parameter klinis sebelum menghitung dosis akhir.</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm space-y-lg">
          <div className="bg-primary-container text-on-primary-container p-md rounded-lg border border-primary flex items-start gap-sm">
            <span className="material-symbols-outlined text-primary mt-1">info</span>
            <p className="text-body-sm">
              Sistem telah mendeteksi <b>{patient.age} tahun</b> ({patient.weight} kg). Target dosis awal diatur ke default untuk <b>{drug.name}</b>. Silakan sesuaikan bentuk sediaan dan parameter jika diperlukan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">

            <div className="space-y-xs md:col-span-2">
              <label className="text-label-caps font-label-caps text-on-surface-variant flex items-center gap-1">
                Bentuk Sediaan & Rute Pemberian
              </label>
              <select
                className="block w-full px-md py-4 bg-surface border border-outline-variant rounded-xl text-headline-sm font-bold focus:ring-2 focus:ring-primary focus:border-primary transition-all text-primary"
                value={parameter.preparationId}
                onChange={(e) => setParameter({ ...parameter, preparationId: e.target.value })}
              >
                {drug.preparations.map(prep => (
                  <option key={prep.id} value={prep.id}>
                    {prep.name} (Rute: {prep.route.replace('oral_', 'Oral ').replace('injeksi_', 'Injeksi ').toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-xs">
              <label className="text-label-caps font-label-caps text-on-surface-variant flex items-center gap-1">
                Indikasi Medis
              </label>
              <select
                className="block w-full px-md py-3 bg-surface border border-outline-variant rounded-xl text-body-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                value={parameter.indication}
                onChange={(e) => setParameter({ ...parameter, indication: e.target.value })}
              >
                <option value="Infeksi Ringan - Sedang">Indikasi Umum / Ringan-Sedang</option>
                <option value="Infeksi Berat">Indikasi Berat / Khusus</option>
                <option value="Profilaksis">Profilaksis</option>
              </select>
            </div>

            <div className="space-y-xs">
              <label className="text-label-caps font-label-caps text-on-surface-variant flex items-center justify-between">
                <span>Target Dosis Harian</span>
                <span className="text-primary font-bold">{parameter.doseMgPerKg} mg/kg</span>
              </label>
              <input
                type="range"
                min="0.01"
                max="100"
                step={drug.baseDoseMgPerKg < 1 ? 0.01 : 5}
                value={parameter.doseMgPerKg}
                onChange={(e) => setParameter({ ...parameter, doseMgPerKg: parseFloat(e.target.value) })}
                className="w-full accent-primary h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-on-surface-variant font-dosage-mono">
                <span>Min</span>
                <span>Max</span>
              </div>
            </div>

            <div className="space-y-xs">
              <label className="text-label-caps font-label-caps text-on-surface-variant flex items-center gap-1">
                Frekuensi Pemberian
              </label>
              <div className="relative flex items-center">
                <input
                  className="block w-full pl-md pr-24 py-3 bg-surface border border-outline-variant rounded-xl text-body-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all font-dosage-mono"
                  type="number" min="1" max="12"
                  value={parameter.frequency}
                  onChange={(e) => setParameter({ ...parameter, frequency: parseInt(e.target.value) || 1 })}
                />
                <span className="absolute right-md text-body-md text-on-surface-variant select-none pointer-events-none">kali sehari</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-outline-variant">
            <button
              className="flex-1 bg-surface-container-highest text-on-surface-variant font-bold py-4 rounded-xl flex items-center justify-center gap-sm transition-all hover:bg-outline-variant"
              onClick={onBack}
            >
              Kembali
            </button>
            <button
              className="flex-[2] bg-primary text-on-primary font-bold py-4 rounded-xl flex items-center justify-center gap-sm transition-all active:scale-[0.98] shadow-md shadow-primary/20 hover:bg-primary-container hover:text-on-primary-container"
              onClick={onNext}
            >
              <span>Kalkulasi Dosis</span>
              <span className="material-symbols-outlined">calculate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <aside className="lg:col-span-4 space-y-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md">
          <h3 className="font-bold text-body-md mb-md flex items-center gap-2 border-b border-outline-variant pb-2">
            <span className="material-symbols-outlined text-primary">person</span>
            Ringkasan Pasien
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-on-surface-variant text-body-sm">Usia</span>
              <span className="font-bold">{patient.age} Tahun</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant text-body-sm">Berat Badan</span>
              <span className="font-bold">{patient.weight} kg</span>
            </div>
            {patient.conditions.length > 0 && (
              <div className="pt-2">
                <span className="text-on-surface-variant text-body-sm block mb-1">Kondisi Khusus:</span>
                <div className="flex flex-wrap gap-1">
                  {patient.conditions.map(c => (
                    <span key={c} className="bg-error-container text-on-error-container text-[10px] px-2 py-1 rounded font-bold">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md">
          <h3 className="font-bold text-body-md mb-md flex items-center gap-2 border-b border-outline-variant pb-2">
            <span className="material-symbols-outlined text-primary">medication</span>
            Sediaan Terpilih
          </h3>
          <div className="space-y-2">
            <p className="font-bold text-on-surface leading-tight">{drug.name}</p>
            <p className="text-body-sm text-on-surface-variant">{selectedPrep?.name}</p>
            <div className="mt-4 bg-surface-container rounded p-2 text-xs font-dosage-mono text-on-surface-variant">
              {selectedPrep?.route.includes('sirup') || selectedPrep?.route.includes('injeksi')
                ? `Konsentrasi: ${selectedPrep.concentrationMg}mg / ${selectedPrep.concentrationMl}mL`
                : `Dosis per unit: ${selectedPrep?.dosePerUnitMg} mg`
              }
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Step3Parameter;
