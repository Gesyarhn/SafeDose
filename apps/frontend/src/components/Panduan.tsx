import React from 'react';

const Panduan: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-sm">
        <h1 className="text-headline-md font-headline-md text-on-surface uppercase tracking-tight">Panduan Penggunaan</h1>
        <p className="text-body-md text-on-surface-variant">Pelajari cara memaksimalkan fitur Mediku untuk praktik klinis Anda.</p>
      </div>

      <div className="space-y-lg">
        {/* Kalkulator Dasar */}
        <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="bg-surface-container p-md border-b border-outline-variant flex items-center gap-md">
            <span className="material-symbols-outlined text-primary text-2xl">calculate</span>
            <h2 className="font-bold text-headline-sm text-on-surface">Kalkulator Dosis (Standar)</h2>
          </div>
          <div className="p-lg space-y-4 text-body-md text-on-surface-variant">
            <p>Fitur utama Mediku digunakan untuk menghitung dosis harian dan volume sediaan cair dengan presisi tinggi.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li><b>Profil Pasien:</b> Masukkan Usia, Berat Badan, dan kondisi klinis. Jika pasien anak (≤ 18 tahun), jenis kelamin wajib diisi.</li>
              <li><b>Pilih Obat:</b> Cari obat yang ingin diresepkan. Obat difilter berdasarkan indikasi yang aman.</li>
              <li><b>Parameter:</b> Verifikasi parameter (Indikasi, Target mg/kg, Frekuensi). Anda bisa menggeser slider jika target dosis ingin diubah.</li>
              <li><b>Hasil:</b> Sistem akan memunculkan takaran per pemberian, konversi sendok (C/cth), kebutuhan jumlah botol terapi, serta batas maksimal BPJS.</li>
            </ol>
          </div>
        </section>

        {/* Mode IGD */}
        <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm border-l-4 border-l-error">
          <div className="bg-error-container/20 p-md border-b border-outline-variant flex items-center gap-md">
            <span className="material-symbols-outlined text-error text-2xl animate-pulse">emergency</span>
            <h2 className="font-bold text-headline-sm text-on-surface">Mode IGD (Emergency)</h2>
          </div>
          <div className="p-lg space-y-4 text-body-md text-on-surface-variant">
            <p>Mode IGD dirancang dengan <i>UI kontras tinggi</i> untuk situasi kritis (resusitasi, henti jantung, syok anafilaktik).</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Abaikan parameter kompleks, langsung masukkan <b>Usia</b> dan <b>Berat Badan</b>.</li>
              <li>Pilih algoritma darurat yang sedang dihadapi.</li>
              <li>Sistem akan langsung menampilkan dosis bolus titrasi dan laju infus standar (contoh: Epinefrin, Amiodaron) tanpa melewati langkah konfirmasi yang panjang.</li>
            </ul>
          </div>
        </section>

        {/* Kebijakan Keselamatan */}
        <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="bg-surface-container p-md border-b border-outline-variant flex items-center gap-md">
            <span className="material-symbols-outlined text-secondary text-2xl">verified_user</span>
            <h2 className="font-bold text-headline-sm text-on-surface">Kebijakan Keselamatan Klinis</h2>
          </div>
          <div className="p-lg space-y-4 text-body-md text-on-surface-variant">
            <p>
              Mediku bertindak sebagai <b>Alat Bantu Pendukung Keputusan (Clinical Decision Support)</b>. Aplikasi ini <b>TIDAK MENGGANTIKAN</b> penilaian klinis independen dokter, apoteker, atau perawat yang menangani pasien langsung.
            </p>
            <p>Selalu verifikasi ulang dosis akhir, indikasi, dan kontraindikasi dengan kondisi aktual pasien serta pedoman formularium rumah sakit setempat sebelum melakukan instruksi pengobatan.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Panduan;
