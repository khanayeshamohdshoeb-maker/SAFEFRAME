import React from 'react';
import { useIncidents, AppView } from '../context/IncidentContext';
import { PlusCircle, Sparkles, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, loadDemoIncident } = useIncidents();

  const navLinks: { label: string; view: AppView }[] = [
    { label: 'Overview', view: 'landing' },
    { label: 'Dashboard', view: 'dashboard' },
    { label: 'Privacy Shield', view: 'privacy-shield' },
    { label: 'Innovation', view: 'about' },
    { label: 'Responsible AI', view: 'responsible-ai' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:border-teal-400/50 transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-teal-300 transition-colors whitespace-nowrap shrink-0">
            SAFEFRAME
          </span>
        </button>

        {/* Zone 2: Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          {navLinks.map((link) => {
            const isActive = activeView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => setActiveView(link.view)}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-white py-1 ${
                  isActive
                    ? 'text-teal-400 font-semibold border-b-2 border-teal-400'
                    : 'text-slate-400'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <button
            onClick={loadDemoIncident}
            className="flex items-center gap-1.5 text-amber-400/90 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 py-1"
            title="Load fictional demo incident in 1 click"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try Demo</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('create')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Incident</span>
          </button>
        </div>
      </div>
    </header>
  );
};
