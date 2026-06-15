import React, { useState } from 'react';
import type { PatientData, DrugData, ParameterData } from '../types';
import Step1Profil from './Step1Profil';
import Step2PilihObat from './Step2PilihObat';
import Step3Parameter from './Step3Parameter';
import Step4Hasil from './Step4Hasil';
import DatabaseObat from './DatabaseObat';
import Panduan from './Panduan';

interface StandardModeProps {
  onEnterIgd: () => void;
  onEnterAdmin: () => void;
}

type TabType = 'kalkulator' | 'database' | 'panduan';

const StandardMode: React.FC<StandardModeProps> = ({ onEnterIgd, onEnterAdmin }) => {
  const [activeTab, setActiveTab] = useState<TabType>('kalkulator');
  const [currentStep, setCurrentStep] = useState(1);
  const [patient, setPatient] = useState<PatientData>({ age: 0, weight: 0, gender: '', conditions: [] });
  const [drug, setDrug] = useState<DrugData | null>(null);
  const [parameter, setParameter] = useState<ParameterData>({ indication: 'Infeksi Ringan - Sedang', doseMgPerKg: 50, frequency: 3, preparationId: '' });

  const handleSelectDrug = (selected: DrugData) => {
    setDrug(selected);
    setParameter({
      indication: 'Infeksi Ringan - Sedang',
      doseMgPerKg: selected.baseDoseMgPerKg,
      frequency: selected.frequencyPerDay,
      preparationId: selected.preparations[0]?.id || ''
    });
  };

  const getScaleX = () => {
    switch (currentStep) {
      case 1: return 'scale-x-0';
      case 2: return 'scale-x-[0.33]';
      case 3: return 'scale-x-[0.66]';
      case 4: return 'scale-x-100';
      default: return 'scale-x-0';
    }
  };

  const renderStepIcon = (stepNumber: number) => {
    if (currentStep > stepNumber) {
      return (
        <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-sm">check</span>
        </div>
      );
    } else if (currentStep === stepNumber) {
      return (
        <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg ring-4 ring-primary-fixed">
          <span className="font-bold">{stepNumber}</span>
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center shadow-sm">
          <span className="font-bold">{stepNumber}</span>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="docked full-width top-0 sticky z-50 bg-surface dark:bg-inverse-surface border-b border-outline-variant dark:border-outline shadow-sm">
        <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-16">
          <div className="text-headline-md font-headline-md font-bold text-primary dark:text-primary-fixed">Mediku</div>
          <nav className="hidden md:flex gap-lg h-full items-end">
            <button
              onClick={() => setActiveTab('kalkulator')}
              className={`font-bold pb-4 border-b-4 transition-colors ${activeTab === 'kalkulator' ? 'text-primary dark:text-primary-fixed border-primary dark:border-primary-fixed' : 'text-on-surface-variant border-transparent hover:text-primary'}`}
            >
              Kalkulator
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`font-bold pb-4 border-b-4 transition-colors ${activeTab === 'database' ? 'text-primary dark:text-primary-fixed border-primary dark:border-primary-fixed' : 'text-on-surface-variant border-transparent hover:text-primary'}`}
            >
              Database Obat
            </button>
            <button
              onClick={() => setActiveTab('panduan')}
              className={`font-bold pb-4 border-b-4 transition-colors ${activeTab === 'panduan' ? 'text-primary dark:text-primary-fixed border-primary dark:border-primary-fixed' : 'text-on-surface-variant border-transparent hover:text-primary'}`}
            >
              Panduan
            </button>
          </nav>
          <div className="flex items-center gap-md">
            <button 
              className="flex px-md py-xs rounded-xl border border-primary text-primary font-bold hover:bg-primary-container hover:text-on-primary-container transition-all items-center gap-xs"
              onClick={onEnterAdmin}
            >
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              <span className="hidden sm:inline">Admin</span>
            </button>
            <button className="bg-error text-on-error px-md py-xs rounded-xl font-bold flex items-center gap-xs hover:opacity-90 active:scale-95 transition-all shadow-md shadow-error/20" onClick={onEnterIgd}>
              <span className="material-symbols-outlined text-[18px]">emergency</span>
              Mode IGD
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-desktop py-xl overflow-x-hidden">

        {/* Render Kalkulator Flow */}
        {activeTab === 'kalkulator' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Step Indicator */}
            <div className="mb-10 w-full max-w-3xl mx-auto">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container-highest -translate-y-1/2 z-0"></div>
                <div className={`absolute top-1/2 left-0 w-full h-1 bg-primary -translate-y-1/2 z-0 origin-left transition-transform duration-500 ${getScaleX()}`}></div>

                <div className="relative z-10 flex flex-col items-center cursor-pointer transition-all hover:opacity-80" onClick={() => setCurrentStep(1)}>
                  {renderStepIcon(1)}
                  <span className={`text-label-caps font-label-caps mt-2 ${currentStep >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>Pasien</span>
                </div>

                <div className="relative z-10 flex flex-col items-center cursor-pointer transition-all hover:opacity-80" onClick={() => setCurrentStep(2)}>
                  {renderStepIcon(2)}
                  <span className={`text-label-caps font-label-caps mt-2 ${currentStep >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}>Obat</span>
                </div>

                <div className="relative z-10 flex flex-col items-center cursor-pointer transition-all hover:opacity-80" onClick={() => setCurrentStep(3)}>
                  {renderStepIcon(3)}
                  <span className={`text-label-caps font-label-caps mt-2 ${currentStep >= 3 ? 'text-primary' : 'text-on-surface-variant'}`}>Parameter</span>
                </div>

                <div className="relative z-10 flex flex-col items-center cursor-pointer transition-all hover:opacity-80" onClick={() => setCurrentStep(4)}>
                  {renderStepIcon(4)}
                  <span className={`text-label-caps font-label-caps mt-2 ${currentStep >= 4 ? 'text-primary' : 'text-on-surface-variant'}`}>Hasil</span>
                </div>
              </div>
            </div>

            {/* Step Content */}
            {currentStep === 1 && (
              <Step1Profil
                patient={patient}
                setPatient={setPatient}
                onNext={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 2 && (
              <Step2PilihObat
                selectedDrug={drug}
                onSelectDrug={handleSelectDrug}
                onNext={() => setCurrentStep(3)}
              />
            )}
            {currentStep === 3 && (
              <Step3Parameter
                patient={patient}
                drug={drug!}
                parameter={parameter}
                setParameter={setParameter}
                onBack={() => setCurrentStep(2)}
                onNext={() => setCurrentStep(4)}
              />
            )}
            {currentStep === 4 && (
              <Step4Hasil
                patient={patient}
                drug={drug!}
                parameter={parameter}
                onRestart={() => {
                  setPatient({ age: 0, weight: 0, gender: '', conditions: [] });
                  setDrug(null);
                  setCurrentStep(1);
                }}
              />
            )}
          </div>
        )}

        {/* Render Database Obat */}
        {activeTab === 'database' && (
          <DatabaseObat />
        )}

        {/* Render Panduan */}
        {activeTab === 'panduan' && (
          <Panduan />
        )}

      </main>

      <footer className="w-full py-xl px-margin-desktop max-w-container-max mx-auto border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-md mt-xl">
        <div className="flex flex-col gap-xs">
          <span className="text-body-md font-bold text-primary dark:text-primary-fixed">Mediku</span>
          <p className="text-body-sm font-body-sm text-on-surface-variant dark:text-surface-variant">© 2024 Mediku Indonesia. Dibuat untuk profesional medis.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-lg">
          <a className="text-label-caps font-label-caps text-on-surface-variant dark:text-surface-variant hover:underline hover:text-primary transition-all" href="#">Tentang Kami</a>
          <a className="text-label-caps font-label-caps text-on-surface-variant dark:text-surface-variant hover:underline hover:text-primary transition-all" href="#">Kebijakan Privasi</a>
          <a className="text-label-caps font-label-caps text-on-surface-variant dark:text-surface-variant hover:underline hover:text-primary transition-all" href="#">Disclaimer Medis</a>
        </div>
      </footer>

      {/* Bottom Navigation Bar (Mobile only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 md:hidden bg-surface dark:bg-inverse-surface border-t border-outline-variant dark:border-outline shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div
          className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 scale-95 transition-all cursor-pointer ${activeTab === 'kalkulator' ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary' : 'text-on-surface-variant'}`}
          onClick={() => setActiveTab('kalkulator')}
        >
          <span className="material-symbols-outlined">calculate</span>
          <span className="text-[10px] font-label-caps tracking-wide">Kalkulator</span>
        </div>
        <div
          className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 scale-95 transition-all cursor-pointer ${activeTab === 'database' ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary' : 'text-on-surface-variant'}`}
          onClick={() => setActiveTab('database')}
        >
          <span className="material-symbols-outlined">medication</span>
          <span className="text-[10px] font-label-caps tracking-wide">Obat</span>
        </div>
        <div
          className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 scale-95 transition-all cursor-pointer ${activeTab === 'panduan' ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary' : 'text-on-surface-variant'}`}
          onClick={() => setActiveTab('panduan')}
        >
          <span className="material-symbols-outlined">menu_book</span>
          <span className="text-[10px] font-label-caps tracking-wide">Panduan</span>
        </div>
        <div
          className="flex flex-col items-center justify-center text-error hover:bg-error-container rounded-xl px-3 py-1 scale-95 transition-all cursor-pointer"
          onClick={onEnterIgd}
        >
          <span className="material-symbols-outlined">emergency</span>
          <span className="text-[10px] font-label-caps tracking-wide">Mode IGD</span>
        </div>
      </nav>
    </div>
  );
};

export default StandardMode;
