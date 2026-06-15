import React from 'react';

import type { PatientData } from '../types';

interface Step1ProfilProps {
  patient: PatientData;
  setPatient: (p: PatientData) => void;
  onNext: () => void;
}

const Step1Profil: React.FC<Step1ProfilProps> = ({ patient, setPatient, onNext }) => {

  const isPediatric = patient.age <= 18;
  const isGenderRequired = isPediatric;
  const isGenderValid = !isGenderRequired || patient.gender !== '';
  const isNextDisabled = patient.age === 0 && patient.weight === 0 || !isGenderValid;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
      <div className="lg:col-span-8 space-y-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-sm">
          <h1 className="text-headline-md font-headline-md text-on-surface uppercase tracking-tight">Profil Pasien</h1>
          <p className="text-body-md text-on-surface-variant">Lengkapi data profil pasien untuk penghitungan dosis yang akurat.</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
          <div className="space-y-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-xs">
                <label className="text-label-caps font-label-caps text-on-surface-variant flex items-center gap-1">
                  Usia <span className="text-error">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    className="block w-full pl-md pr-16 py-3 bg-surface border border-outline-variant rounded-xl text-body-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    max="120" min="0" placeholder="0" type="number"
                    value={patient.age || ''}
                    onChange={(e) => setPatient({ ...patient, age: parseInt(e.target.value) || 0 })}
                  />
                  <span className="absolute right-md text-body-md text-on-surface-variant select-none pointer-events-none">Tahun</span>
                </div>
              </div>

              <div className="space-y-xs">
                <label className="text-label-caps font-label-caps text-on-surface-variant flex items-center gap-1">
                  Berat Badan <span className="text-error">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    className="block w-full pl-md pr-12 py-3 bg-surface border border-outline-variant rounded-xl text-body-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    max="300" min="0" placeholder="0.0" step="0.1" type="number"
                    value={patient.weight || ''}
                    onChange={(e) => setPatient({ ...patient, weight: parseFloat(e.target.value) || 0 })}
                  />
                  <span className="absolute right-md text-body-md text-on-surface-variant select-none pointer-events-none">kg</span>
                </div>
              </div>

              <div className="space-y-xs md:col-span-2">
                <label className="text-label-caps font-label-caps text-on-surface-variant flex items-center gap-1">
                  Jenis Kelamin
                  {isGenderRequired ? (
                    <span className="text-error">* <span className="font-normal opacity-80">(Wajib untuk Usia ≤ 18)</span></span>
                  ) : (
                    <span className="font-normal opacity-80 italic">(Opsional)</span>
                  )}
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer p-3 border border-outline-variant rounded-xl flex-1 hover:bg-surface-container-low transition-colors">
                    <input
                      type="radio"
                      name="gender"
                      value="Laki-laki"
                      className="text-primary focus:ring-primary w-5 h-5"
                      checked={patient.gender === 'Laki-laki'}
                      onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                    />
                    <span className="text-body-md font-medium">Laki-laki</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 border border-outline-variant rounded-xl flex-1 hover:bg-surface-container-low transition-colors">
                    <input
                      type="radio"
                      name="gender"
                      value="Perempuan"
                      className="text-primary focus:ring-primary w-5 h-5"
                      checked={patient.gender === 'Perempuan'}
                      onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                    />
                    <span className="text-body-md font-medium">Perempuan</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="">
              <button
                className="w-full bg-primary disabled:bg-outline-variant disabled:opacity-50 disabled:cursor-not-allowed text-on-primary font-bold py-4 rounded-xl flex items-center justify-center gap-sm transition-all active:scale-[0.98]"
                disabled={isNextDisabled}
                onClick={onNext}
              >
                <span>Lanjut ke Pemilihan Obat</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside className="lg:col-span-4 space-y-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-tertiary-container text-on-tertiary-container rounded-xl p-md shadow-sm">
          <div className="flex items-center gap-2 mb-sm">
            <span className="material-symbols-outlined">lightbulb</span>
            <h3 className="font-bold text-headline-sm">Tips Parameter</h3>
          </div>
          <ul className="space-y-sm text-body-sm list-disc pl-4 opacity-90">
            <li>Pastikan usia pasien diinput dalam satuan tahun penuh (pembulatan ke bawah).</li>
            <li>Untuk bayi &lt; 1 tahun, gunakan input 0 tahun dan lengkapi berat badan secara detail.</li>
            <li>Input berat badan aktual untuk pasien non-obesitas.</li>
            <li>Gunakan <i>Ideal Body Weight</i> (IBW) untuk obat-obat hidrofilik pada pasien obesitas.</li>
          </ul>
        </div>

        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md">
          <h3 className="font-bold text-body-md mb-md flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">table_chart</span>
            Referensi BB per Usia (WHO)
          </h3>
          <div className="overflow-hidden rounded-lg border border-outline-variant">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-surface-container-high text-on-surface-variant text-label-caps">
                <tr>
                  <th className="px-3 py-2">Usia</th>
                  <th className="px-3 py-2">Laki-laki</th>
                  <th className="px-3 py-2">Perempuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                <tr>
                  <td className="px-3 py-2 bg-surface-container-lowest">Baru Lahir</td>
                  <td className="px-3 py-2">3.3 kg</td>
                  <td className="px-3 py-2">3.2 kg</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">1 Tahun</td>
                  <td className="px-3 py-2">9.6 kg</td>
                  <td className="px-3 py-2">8.9 kg</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 bg-surface-container-lowest">5 Tahun</td>
                  <td className="px-3 py-2">18.3 kg</td>
                  <td className="px-3 py-2">18.2 kg</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">10 Tahun</td>
                  <td className="px-3 py-2">32.0 kg</td>
                  <td className="px-3 py-2">33.0 kg</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 bg-surface-container-lowest">15 Tahun</td>
                  <td className="px-3 py-2">56.0 kg</td>
                  <td className="px-3 py-2">54.0 kg</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-on-surface-variant italic leading-tight">
            *Data merupakan nilai median berat badan berdasarkan standar pertumbuhan WHO. Selalu prioritaskan penimbangan aktual.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default Step1Profil;
