import React, { useState } from 'react';
import { useSearchDrugs } from '../hooks/use-drugs';

const DatabaseObat: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: drugs = [], isLoading } = useSearchDrugs(searchQuery);

  return (
    <div className="max-w-4xl mx-auto space-y-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-sm">
        <h1 className="text-headline-md font-headline-md text-on-surface uppercase tracking-tight">Database Obat</h1>
        <p className="text-body-md text-on-surface-variant">Pusat informasi referensi obat, bersumber dari panduan klinis nasional.</p>
      </div>

      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-lg">
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-primary text-4xl">database</span>
            <div>
              <h2 className="text-headline-sm font-bold text-on-surface">Data Tersedia</h2>
              <p className="text-body-sm text-on-surface-variant">Total {drugs.length} obat terintegrasi</p>
            </div>
          </div>
          
          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder="Cari nama atau jenis obat..."
              className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : drugs.length === 0 ? (
          <div className="text-center py-xl text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
            <p>Obat tidak ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {drugs.map((drug) => (
              <div key={drug.id} className="bg-surface border border-outline-variant rounded-lg p-md flex flex-col gap-xs hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-on-surface text-body-lg leading-tight">{drug.name}</span>
                  <span className="bg-primary-container text-on-primary-container text-[10px] px-2 py-1 rounded-full whitespace-nowrap">
                    {drug.referenceSource || 'Umum'}
                  </span>
                </div>
                <span className="text-body-sm text-secondary font-medium">{drug.type}</span>
                <p className="text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                  <span className="font-bold">Indikasi:</span> {drug.indications || '-'}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {drug.preparations.map(prep => (
                    <span key={prep.id} className="bg-surface-container-highest text-on-surface text-[10px] px-2 py-1 rounded">
                      {prep.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-tertiary-container/10 border border-tertiary/20 rounded-xl p-md flex gap-md items-start">
        <span className="material-symbols-outlined text-tertiary">info</span>
        <div className="space-y-2">
          <h3 className="font-bold text-on-surface">Informasi Penambahan Data</h3>
          <p className="text-body-sm text-on-surface-variant">
            Data obat dapat ditambah secara bertahap melalui sistem admin (API). Saat ini terdapat sampel obat yang merepresentasikan panduan klinis dari IDAI, PERKENI, PAPDI, POGI, PERKI, dan PERDOSKI.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseObat;
