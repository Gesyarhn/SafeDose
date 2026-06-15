import React, { useState, useEffect } from 'react';
import { useEmergencyDrugs } from '../hooks/use-emergency-drugs';
import type { EmergencyDrug } from '../types';

interface IgdModeProps {
  onExit: () => void;
}

interface IgdPatient {
  age: number;
  weight: number;
}


const IgdMode: React.FC<IgdModeProps> = ({ onExit }) => {
  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState<IgdPatient>({ age: 0, weight: 0 });
  const [selectedDrug, setSelectedDrug] = useState<EmergencyDrug | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: emergencyDrugs = [], isLoading } = useEmergencyDrugs(searchQuery || undefined);

  useEffect(() => {
    document.body.classList.add('igd-mode');
    return () => {
      document.body.classList.remove('igd-mode');
    };
  }, []);

  const handleExit = () => {
    if (window.confirm('Anda sedang dalam Mode IGD. Keluar sekarang akan membatalkan kalkulasi aktif. Lanjutkan?')) {
      onExit();
    }
  };

  const calculateDose = (drug: EmergencyDrug) => {
    let mg = patient.weight * drug.doseMgPerKg;
    if (drug.minDoseMg && mg < drug.minDoseMg) mg = drug.minDoseMg;
    if (mg > drug.maxDoseMg) mg = drug.maxDoseMg;

    const ml = (mg / drug.concentrationMg) * drug.concentrationMl;
    return {
      mg: Number.isInteger(mg) ? mg : mg.toFixed(2),
      ml: Number.isInteger(ml) ? ml : ml.toFixed(2)
    };
  };

  return (
    <div className="min-h-screen flex flex-col font-body-md overflow-x-hidden w-full bg-gray-900 text-white">
      <header className="sticky top-0 z-50 w-full bg-orange-900/40 backdrop-blur-md border-b border-orange-500/30 px-margin-mobile md:px-margin-desktop py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-orange-500 animate-emergency" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          <h1 className="text-headline-sm font-headline-sm text-orange-500 tracking-tighter font-bold">MODE IGD AKTIF</h1>
        </div>
        <button 
          onClick={handleExit}
          className="text-label-caps font-label-caps bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-all active:scale-95">
          [✕ KELUAR]
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          <div className="mb-xl text-center">
            <span className="text-label-caps font-label-caps emergency-accent tracking-widest block mb-2 text-red-400 font-bold">
              LANGKAH {step} DARI 3
            </span>
            <h2 className="text-display-lg font-display-lg text-white font-bold">
              {step === 1 ? 'Data Pasien Utama' : step === 2 ? 'Pilih Obat Resusitasi' : 'Instruksi Dosis Bolus'}
            </h2>
            <div className="flex gap-2 justify-center mt-6">
              <div className={`h-2 w-16 rounded-full transition-colors ${step >= 1 ? 'bg-orange-500' : 'bg-gray-700'}`}></div>
              <div className={`h-2 w-16 rounded-full transition-colors ${step >= 2 ? 'bg-orange-500' : 'bg-gray-700'}`}></div>
              <div className={`h-2 w-16 rounded-full transition-colors ${step >= 3 ? 'bg-orange-500' : 'bg-gray-700'}`}></div>
            </div>
          </div>

          {step === 1 && (
            <form 
              className="space-y-xl" 
              onSubmit={(e) => {
                e.preventDefault();
                if (patient.age > 0 && patient.weight > 0) setStep(2);
              }}
            >
              <div className="space-y-4">
                <label className="flex justify-between items-center text-body-lg font-headline-sm text-gray-300" htmlFor="age">
                  <span>Usia Pasien</span>
                  <span className="text-label-caps font-label-caps text-orange-400 font-bold italic">WAJIB</span>
                </label>
                <div className="relative">
                  <input 
                    className="emergency-input w-full p-8 text-dosage-display font-dosage-display rounded-xl text-center md:text-left bg-gray-800 border-2 border-gray-700 focus:border-orange-500 text-white outline-none" 
                    id="age" 
                    placeholder="0" 
                    required 
                    type="number"
                    value={patient.age || ''}
                    onChange={(e) => setPatient({...patient, age: parseInt(e.target.value) || 0})}
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 text-headline-md font-headline-md text-gray-500 pointer-events-none font-bold">
                    TAHUN
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex justify-between items-center text-body-lg font-headline-sm text-gray-300" htmlFor="weight">
                  <span>Berat Badan</span>
                  <span className="text-label-caps font-label-caps text-orange-400 font-bold italic">WAJIB</span>
                </label>
                <div className="relative">
                  <input 
                    className="emergency-input w-full p-8 text-dosage-display font-dosage-display rounded-xl text-center md:text-left bg-gray-800 border-2 border-gray-700 focus:border-orange-500 text-white outline-none" 
                    id="weight" 
                    placeholder="0.0" 
                    required 
                    step="0.1" 
                    type="number"
                    value={patient.weight || ''}
                    onChange={(e) => setPatient({...patient, weight: parseFloat(e.target.value) || 0})}
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 text-headline-md font-headline-md text-gray-500 pointer-events-none font-bold">
                    KG
                  </div>
                </div>
              </div>

              <div className="bg-orange-900/30 border border-orange-500/50 rounded-xl p-md flex items-start gap-md">
                <span className="material-symbols-outlined text-orange-400 mt-1">info</span>
                <p className="text-body-sm font-body-sm text-orange-200">
                  Data ini digunakan untuk menghitung dosis maksimum dan penyesuaian laju infus. Pastikan input akurat untuk keamanan pasien kritis.
                </p>
              </div>

              <button 
                className="w-full bg-orange-600 hover:bg-orange-500 text-white p-8 rounded-xl flex justify-center items-center gap-md transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(249,115,22,0.3)] group disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={patient.age === 0 || patient.weight === 0}
                type="submit">
                <span className="text-headline-md font-headline-md uppercase tracking-tight font-bold">Lanjut</span>
                <span className="material-symbols-outlined text-[32px] group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="relative group mb-2">
                <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-500">search</span>
                </div>
                <input 
                  className="block w-full pl-[48px] pr-md py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-body-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm outline-none" 
                  placeholder="Cari obat resusitasi..." 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 max-h-[50vh] overflow-y-auto pr-2">
                {isLoading ? (
                  <div className="text-center p-8 bg-gray-800 border-2 border-gray-700 rounded-xl">
                    <p className="text-gray-400">Memuat data obat...</p>
                  </div>
                ) : emergencyDrugs.length > 0 ? emergencyDrugs.map(drug => (
                  <button 
                    key={drug.id}
                    onClick={() => {
                      setSelectedDrug(drug);
                      setStep(3);
                    }}
                    className="w-full text-left bg-gray-800 border-2 border-gray-700 hover:border-orange-500 rounded-xl p-6 transition-all active:scale-[0.98] flex items-center justify-between group"
                  >
                    <div>
                      <h3 className="text-display-sm font-display-sm text-white font-bold">{drug.name}</h3>
                      <p className="text-gray-400 font-dosage-mono mt-1">Dosis: {drug.doseMgPerKg} mg/kg</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gray-700 group-hover:bg-orange-600 flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-white">arrow_forward</span>
                    </div>
                  </button>
                )) : (
                  <div className="text-center p-8 bg-gray-800 border-2 border-gray-700 border-dashed rounded-xl">
                     <p className="text-gray-400">Obat tidak ditemukan.</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setStep(1)}
                className="w-full py-4 text-gray-400 hover:text-white font-bold mt-4 border-2 border-gray-800 rounded-xl transition-colors">
                &larr; Kembali ke Data Pasien
              </button>
            </div>
          )}

          {step === 3 && selectedDrug && (
            <div className="space-y-8">
              <div className="bg-orange-900/20 border-2 border-orange-500/50 rounded-2xl p-8 text-center shadow-[0_0_50px_rgba(249,115,22,0.1)]">
                <h3 className="text-headline-md font-bold text-gray-300 mb-2">{selectedDrug.name}</h3>
                
                <div className="my-8">
                  <div className="text-gray-400 text-label-caps tracking-widest mb-2 font-bold">VOLUME BOLUS (IV/IO)</div>
                  <div className="text-[80px] font-dosage-display font-bold text-white leading-none tracking-tighter">
                    {calculateDose(selectedDrug).ml} <span className="text-[40px] text-gray-400">mL</span>
                  </div>
                  <div className="text-headline-sm text-gray-400 font-dosage-mono mt-2">
                    Setara dengan {calculateDose(selectedDrug).mg} mg
                  </div>
                </div>

                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 inline-block">
                  <p className="text-gray-400 text-sm font-dosage-mono">Konsentrasi sediaan: {selectedDrug.concentrationMg}mg/{selectedDrug.concentrationMl}mL</p>
                </div>
              </div>

              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-6 flex items-start gap-4">
                <span className="material-symbols-outlined text-yellow-500 mt-1">warning</span>
                <p className="text-body-lg text-yellow-200">
                  {selectedDrug.notes}
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 py-6 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-bold text-headline-sm transition-colors">
                  Ganti Obat
                </button>
                <button 
                  onClick={() => {
                    setPatient({ age: 0, weight: 0 });
                    setSelectedDrug(null);
                    setStep(1);
                  }}
                  className="flex-1 py-6 bg-orange-600 hover:bg-orange-500 rounded-xl text-white font-bold text-headline-sm transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                  Pasien Baru
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="w-full py-lg px-margin-mobile border-t border-gray-800 text-center mt-auto bg-gray-900">
        <p className="text-label-caps font-label-caps text-gray-500 tracking-widest">
          © 2024 SAFEDOSE INDONESIA • SISTEM PENDUKUNG KEPUTUSAN KLINIS
        </p>
      </footer>
    </div>
  );
};

export default IgdMode;
