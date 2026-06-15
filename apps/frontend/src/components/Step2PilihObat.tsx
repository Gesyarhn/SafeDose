import React, { useState } from 'react';
import { useSearchDrugs } from '../hooks/use-drugs';

import type { RouteType, DrugPreparation, DrugData } from '../types';

// Re-export types for backwards compatibility
export type { RouteType, DrugPreparation, DrugData };

interface Step2PilihObatProps {
  selectedDrug: DrugData | null;
  onSelectDrug: (d: DrugData) => void;
  onNext: () => void;
}

const Step2PilihObat: React.FC<Step2PilihObatProps> = ({ selectedDrug, onSelectDrug, onNext }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: drugResults = [] } = useSearchDrugs(searchQuery || undefined);
  const { data: allDrugs = [] } = useSearchDrugs();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
      {/* Left Column: Selection Interface */}
      <div className="lg:col-span-8 space-y-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-sm">
          <h1 className="text-headline-md font-headline-md text-on-surface uppercase tracking-tight">PILIH OBAT</h1>
          <p className="text-body-md text-on-surface-variant">Masukkan nama generik atau merek dagang obat untuk mulai menghitung dosis.</p>
        </div>

        {/* Large Search Interface */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline">search</span>
          </div>
          <input 
            className="block w-full pl-[48px] pr-md py-xl bg-surface-container-lowest border border-outline-variant rounded-xl text-body-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm" 
            placeholder="Ketik 'Amoksisilin', 'Paracetamol', atau 'Epinefrin'..." 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {/* Search Results Simulation */}
          {searchQuery.length > 0 && !selectedDrug && (
            <div className="absolute z-10 w-full mt-xs bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {drugResults.map(d => (
                <button 
                  key={d.id}
                  className="w-full flex items-center gap-md px-md py-md hover:bg-surface-container-high transition-colors text-left border-b border-outline-variant last:border-0" 
                  onClick={() => {
                    onSelectDrug(d);
                    setSearchQuery('');
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">medication</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{d.name}</p>
                    <p className="text-label-caps font-label-caps text-on-surface-variant">{d.type}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DrugInfoCard (Visible after selection) */}
        {selectedDrug && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-300" id="drug-card">
            <div className="p-lg border-b border-outline-variant bg-surface-container-low flex justify-between items-start">
              <div>
                <div className="flex items-center gap-xs mb-xs">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  <span className="text-label-caps font-label-caps text-primary">OBAT TERVERIFIKASI</span>
                </div>
                <h2 className="text-headline-md font-headline-md text-on-surface">{selectedDrug.name}</h2>
                <p className="text-body-md text-on-surface-variant">{selectedDrug.type}</p>
              </div>
              <span className="bg-error text-on-error px-sm py-xs rounded-full text-label-caps font-label-caps">HIGH ALERT</span>
            </div>
            
            <div className="p-lg grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-md">
                <div>
                  <h3 className="text-label-caps font-label-caps text-on-surface-variant mb-xs">INDIKASI</h3>
                  <p className="text-body-md text-on-surface">Informasi indikasi umum untuk {selectedDrug.name}.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-md">
                  <button className="flex flex-1 items-center justify-between p-md rounded-lg bg-error-container text-on-error-container hover:opacity-90 transition-opacity">
                    <div className="flex items-center gap-xs">
                      <span className="material-symbols-outlined">warning</span>
                      <span className="font-bold">Kontraindikasi</span>
                    </div>
                    <span className="bg-error text-on-error w-6 h-6 flex items-center justify-center rounded-full text-xs">
                      {selectedDrug.contraindications?.length || 0}
                    </span>
                  </button>
                  <button className="flex flex-1 items-center justify-between p-md rounded-lg bg-tertiary-container text-on-tertiary-container hover:opacity-90 transition-opacity">
                    <div className="flex items-center gap-xs">
                      <span className="material-symbols-outlined">sync_problem</span>
                      <span className="font-bold">Interaksi</span>
                    </div>
                    <span className="bg-tertiary text-on-tertiary w-6 h-6 flex items-center justify-center rounded-full text-xs">
                      {selectedDrug.interactions?.length || 0}
                    </span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-md">
                <div className="p-md bg-secondary-container/20 border border-secondary/20 rounded-lg">
                  <h3 className="text-label-caps font-label-caps text-secondary mb-xs">DOSIS STANDAR BASE</h3>
                  <p className="font-dosage-label text-dosage-label text-on-surface">Umum: {selectedDrug.baseDoseMgPerKg} mg/kgBB</p>
                  <p className="text-body-sm text-on-surface-variant mt-2">Dosis aktual akan disesuaikan dengan sediaan dan indikasi di langkah berikutnya.</p>
                </div>
              </div>
            </div>
            
            <div className="p-lg bg-surface-container flex flex-col md:flex-row justify-between items-center gap-md">
              <button className="text-primary font-bold flex items-center gap-xs hover:underline w-full md:w-auto justify-center md:justify-start">
                <span className="material-symbols-outlined">info</span>
                Lihat Detail Farmakologi
              </button>
              <button 
                className="bg-primary text-on-primary w-full md:w-auto px-xl py-md rounded-xl font-bold flex justify-center items-center gap-md hover:bg-primary-container hover:text-on-primary-container active:scale-95 transition-all shadow-md shadow-primary/20"
                onClick={onNext}
              >
                Lanjut ke Parameter
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Sidebar */}
      <aside className="lg:col-span-4 space-y-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
          <div className="flex items-center justify-between mb-lg">
            <h3 className="text-headline-sm font-headline-sm text-on-surface">Terakhir Digunakan</h3>
            <span className="material-symbols-outlined text-outline">history</span>
          </div>
          <div className="space-y-md">
            {allDrugs.map((med, idx) => (
              <div key={idx} className="group flex items-center gap-md p-md rounded-lg hover:bg-surface-container-high transition-all cursor-pointer" onClick={() => onSelectDrug(med)}>
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary group-hover:bg-primary-fixed">
                  <span className="material-symbols-outlined">medication</span>
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-on-surface">{med.id}</p>
                  <p className="text-body-sm text-on-surface-variant truncate w-48">{med.type}</p>
                </div>
                <span className="material-symbols-outlined text-outline opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
              </div>
            ))}
          </div>
        </section>

        {/* Prompt for Favorites (Guest context) */}
        <section className="bg-primary-container text-on-primary-container rounded-xl p-lg relative overflow-hidden">
          <div className="relative z-10 space-y-md">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <h3 className="text-headline-sm font-headline-sm">Obat Favorit</h3>
            </div>
            <p className="text-body-md opacity-90">Simpan daftar obat yang sering Anda gunakan untuk akses lebih cepat.</p>
            <button className="bg-surface-container-lowest text-primary px-lg py-md rounded-lg font-bold w-full hover:bg-on-primary-container hover:text-white transition-all">Masuk Sekarang</button>
          </div>
          {/* Decorative background element */}
          <div className="absolute -bottom-4 -right-4 opacity-10">
            <span className="material-symbols-outlined text-[120px]">bookmark</span>
          </div>
        </section>
        
        <div className="p-lg bg-surface-variant rounded-xl border border-outline-variant space-y-md">
          <div className="flex items-center gap-md text-on-surface-variant">
            <span className="material-symbols-outlined">shield</span>
            <p className="text-body-sm font-medium">Data diperbarui: 24 Oktober 2024 (Edisi ISO Terbaru)</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Step2PilihObat;
