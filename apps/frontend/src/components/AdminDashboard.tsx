import React, { useState } from 'react';
import { useSearchDrugs, useCreateDrug, useDeleteDrug } from '../hooks/use-drugs';
import { useAuth } from '../hooks/use-auth';
import type { CreateDrugPayload } from '../lib/api/drugs';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, signIn, signUp, signOut } = useAuth();
  const { data: drugs = [], isLoading: drugsLoading } = useSearchDrugs();
  const createDrug = useCreateDrug();
  const deleteDrug = useDeleteDrug();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateDrugPayload>({
    name: '',
    baseDoseMgPerKg: 0,
    frequencyPerDay: 1,
    type: '',
    indications: '',
    referenceSource: '',
    preparations: [],
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authError, setAuthError] = useState('');

  if (authLoading) {
    return <div className="p-xl text-center">Loading...</div>;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isLoginMode) {
        const { error } = await signIn.email({ email, password });
        if (error) setAuthError(error.message || 'Login gagal');
      } else {
        const { error } = await signUp.email({ email, password, name: name || 'Admin' });
        if (error) setAuthError(error.message || 'Daftar gagal');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Terjadi kesalahan');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-xl p-xl bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-lg">
        <div className="text-center mb-lg">
          <span className="material-symbols-outlined text-5xl text-primary mb-2">admin_panel_settings</span>
          <h2 className="text-headline-sm font-bold">Admin Panel</h2>
          <p className="text-body-sm text-on-surface-variant">Silakan {isLoginMode ? 'login' : 'daftar'} untuk melanjutkan</p>
        </div>
        
        {authError && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm font-bold">
            {authError}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLoginMode && (
            <div className="space-y-1">
              <label className="text-label-caps font-bold">Nama</label>
              <input type="text" required className="w-full p-3 rounded-xl border border-outline-variant" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-label-caps font-bold">Email</label>
            <input type="email" required className="w-full p-3 rounded-xl border border-outline-variant" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-label-caps font-bold">Password</label>
            <input type="password" required className="w-full p-3 rounded-xl border border-outline-variant" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl shadow-md hover:bg-primary-container hover:text-on-primary-container transition-colors mt-2">
            {isLoginMode ? 'Masuk' : 'Daftar Akun'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-body-sm text-primary hover:underline">
            {isLoginMode ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini'}
          </button>
        </div>
      </div>
    );
  }

  const handleAddPrep = () => {
    setFormData({
      ...formData,
      preparations: [
        ...(formData.preparations || []),
        { name: '', route: 'oral_tablet', dosePerUnitMg: 0 },
      ],
    });
  };

  const handlePrepChange = (index: number, field: string, value: any) => {
    const newPreps = [...(formData.preparations || [])];
    newPreps[index] = { ...newPreps[index], [field]: value };
    setFormData({ ...formData, preparations: newPreps });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDrug.mutate(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ name: '', baseDoseMgPerKg: 0, frequencyPerDay: 1, type: '', indications: '', referenceSource: '', preparations: [] });
      },
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus obat ini?')) {
      deleteDrug.mutate(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-xl animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-sm">
          <h1 className="text-headline-md font-headline-md text-primary uppercase tracking-tight">Admin Dashboard</h1>
          <p className="text-body-md text-on-surface-variant">Manajemen Data Obat & Referensi Klinis</p>
        </div>
        <div className="flex gap-md">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-on-primary px-lg py-md rounded-xl font-bold flex items-center gap-xs hover:bg-primary-container hover:text-on-primary-container transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Tambah Obat Baru
          </button>
          <button 
            onClick={async () => await signOut()}
            className="bg-surface-variant text-on-surface-variant px-md py-md rounded-xl font-bold flex items-center gap-xs hover:bg-error hover:text-on-error transition-colors"
            title="Keluar"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-label-caps border-b border-outline-variant">
                <th className="p-md">Nama Obat</th>
                <th className="p-md">Kategori / Tipe</th>
                <th className="p-md">Dosis Base</th>
                <th className="p-md">Sediaan</th>
                <th className="p-md text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {drugsLoading ? (
                <tr><td colSpan={5} className="p-xl text-center">Memuat data...</td></tr>
              ) : drugs.length === 0 ? (
                <tr><td colSpan={5} className="p-xl text-center">Belum ada data obat.</td></tr>
              ) : (
                drugs.map(drug => (
                  <tr key={drug.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-md font-bold text-on-surface">{drug.name}</td>
                    <td className="p-md text-body-sm text-secondary">{drug.type}</td>
                    <td className="p-md text-body-sm font-dosage-mono">{drug.baseDoseMgPerKg} mg/kg</td>
                    <td className="p-md text-body-sm">
                      {drug.preparations.length} sediaan
                    </td>
                    <td className="p-md text-right">
                      <button 
                        onClick={() => handleDelete(drug.id)}
                        className="text-error hover:bg-error-container p-2 rounded-lg transition-colors"
                        title="Hapus Obat"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Drug Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h2 className="text-headline-sm font-bold text-on-surface">Tambah Obat Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-error">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-lg overflow-y-auto flex-grow space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="text-label-caps font-bold">Nama Obat</label>
                  <input required type="text" className="w-full p-3 rounded-lg border border-outline-variant" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Misal: Amoksisilin" />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-caps font-bold">Kategori / Tipe</label>
                  <input required type="text" className="w-full p-3 rounded-lg border border-outline-variant" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="Misal: Antibiotik" />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-caps font-bold">Dosis Dasar (mg/kgBB)</label>
                  <input required type="number" step="0.01" className="w-full p-3 rounded-lg border border-outline-variant" value={formData.baseDoseMgPerKg} onChange={e => setFormData({...formData, baseDoseMgPerKg: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-caps font-bold">Frekuensi Per Hari</label>
                  <input required type="number" className="w-full p-3 rounded-lg border border-outline-variant" value={formData.frequencyPerDay} onChange={e => setFormData({...formData, frequencyPerDay: parseInt(e.target.value) || 1})} />
                </div>
                <div className="space-y-xs md:col-span-2">
                  <label className="text-label-caps font-bold">Indikasi Utama</label>
                  <input type="text" className="w-full p-3 rounded-lg border border-outline-variant" value={formData.indications} onChange={e => setFormData({...formData, indications: e.target.value})} placeholder="Pneumonia, ISK..." />
                </div>
                <div className="space-y-xs md:col-span-2">
                  <label className="text-label-caps font-bold">Sumber Referensi</label>
                  <input type="text" className="w-full p-3 rounded-lg border border-outline-variant" value={formData.referenceSource} onChange={e => setFormData({...formData, referenceSource: e.target.value})} placeholder="Buku Saku IDAI 2023" />
                </div>
              </div>

              <div className="mt-xl pt-lg border-t border-outline-variant">
                <div className="flex justify-between items-center mb-md">
                  <h3 className="text-body-lg font-bold">Sediaan Tersedia</h3>
                  <button type="button" onClick={handleAddPrep} className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                    <span className="material-symbols-outlined text-sm">add_circle</span> Tambah Sediaan
                  </button>
                </div>
                
                <div className="space-y-sm">
                  {formData.preparations?.map((prep, idx) => (
                    <div key={idx} className="p-md bg-surface-container border border-outline-variant rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-sm relative">
                      <button type="button" onClick={() => {
                        const newP = [...formData.preparations!];
                        newP.splice(idx, 1);
                        setFormData({...formData, preparations: newP});
                      }} className="absolute -top-2 -right-2 bg-error text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                      
                      <div className="space-y-xs">
                        <label className="text-[10px] font-bold uppercase">Nama Sediaan</label>
                        <input required type="text" className="w-full p-2 text-sm rounded border border-outline-variant" value={prep.name} onChange={e => handlePrepChange(idx, 'name', e.target.value)} placeholder="Sirup 125mg/5ml" />
                      </div>
                      <div className="space-y-xs">
                        <label className="text-[10px] font-bold uppercase">Rute</label>
                        <select className="w-full p-2 text-sm rounded border border-outline-variant" value={prep.route} onChange={e => handlePrepChange(idx, 'route', e.target.value as any)}>
                          <option value="oral_sirup">Oral Sirup</option>
                          <option value="oral_tablet">Oral Tablet</option>
                          <option value="oral_kapsul">Oral Kapsul</option>
                          <option value="injeksi_iv">Injeksi IV</option>
                        </select>
                      </div>
                      <div className="space-y-xs">
                        <label className="text-[10px] font-bold uppercase">Kandungan (mg)</label>
                        <input type="number" className="w-full p-2 text-sm rounded border border-outline-variant" value={prep.concentrationMg || prep.dosePerUnitMg || ''} 
                          onChange={e => {
                            const val = parseFloat(e.target.value) || 0;
                            if (prep.route === 'oral_sirup' || prep.route.includes('injeksi')) {
                              handlePrepChange(idx, 'concentrationMg', val);
                              handlePrepChange(idx, 'concentrationMl', 5); // default
                            } else {
                              handlePrepChange(idx, 'dosePerUnitMg', val);
                            }
                          }} 
                          placeholder="mg" 
                        />
                      </div>
                    </div>
                  ))}
                  {(!formData.preparations || formData.preparations.length === 0) && (
                    <p className="text-body-sm text-on-surface-variant text-center py-4 italic">Belum ada sediaan. Tambahkan minimal satu.</p>
                  )}
                </div>
              </div>

              <div className="pt-xl flex justify-end gap-md">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-lg py-md text-on-surface-variant font-bold hover:bg-surface-container rounded-xl">Batal</button>
                <button type="submit" disabled={createDrug.isPending} className="px-lg py-md bg-primary text-on-primary font-bold rounded-xl shadow-md disabled:opacity-50 flex items-center gap-2">
                  {createDrug.isPending ? 'Menyimpan...' : 'Simpan Obat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
