import { useState } from 'react';
import StandardMode from './components/StandardMode';
import IgdMode from './components/IgdMode';
import AdminDashboard from './components/AdminDashboard';

export type AppView = 'standard' | 'igd' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('standard');

  return (
    <>
      {currentView === 'igd' && (
        <IgdMode onExit={() => setCurrentView('standard')} />
      )}
      {currentView === 'admin' && (
        <div className="min-h-screen bg-surface">
          <header className="bg-surface-container-lowest border-b border-outline-variant p-4 flex justify-between items-center sticky top-0 z-50">
            <h1 className="text-headline-sm font-bold text-primary">Mediku</h1>
            <button
              onClick={() => setCurrentView('standard')}
              className="text-on-surface-variant hover:text-primary font-bold px-4 py-2"
            >
              Kembali ke Kalkulator
            </button>
          </header>
          <main className="p-xl">
            <AdminDashboard />
          </main>
        </div>
      )}
      {currentView === 'standard' && (
        <StandardMode
          onEnterIgd={() => setCurrentView('igd')}
          onEnterAdmin={() => setCurrentView('admin')}
        />
      )}
    </>
  );
}

export default App;
