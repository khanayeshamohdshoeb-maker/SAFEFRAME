/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { IncidentProvider, useIncidents } from './context/IncidentContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { CreateIncidentWizard } from './components/CreateIncidentWizard';
import { IncidentIntelligenceWorkspace } from './components/IncidentIntelligenceWorkspace';
import { ResponsibleAIPage } from './components/ResponsibleAIPage';
import { AboutInnovationPage } from './components/AboutInnovationPage';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, setActiveView, loadDemoIncident } = useIncidents();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Bar Navigation */}
      <div className="no-print">
        <Navbar />
      </div>

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === 'landing' && <LandingPage />}
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'create' && <CreateIncidentWizard />}
        {activeView === 'responsible-ai' && <ResponsibleAIPage />}
        {activeView === 'about' && <AboutInnovationPage />}
        {(activeView === 'incident-overview' ||
          activeView === 'timeline' ||
          activeView === 'privacy-shield' ||
          activeView === 'evidence-pack' ||
          activeView === 'what-changed' ||
          activeView === 'connections') && <IncidentIntelligenceWorkspace />}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950/80 py-10 mt-20 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>SAFEFRAME</span>
            </div>
            <p className="text-slate-500 max-w-sm">
              Turn scattered evidence into a clear, privacy-protected incident record.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <button
              onClick={() => setActiveView('landing')}
              className="hover:text-teal-300 transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className="hover:text-teal-300 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('about')}
              className="hover:text-teal-300 transition-colors"
            >
              Innovation
            </button>
            <button
              onClick={() => setActiveView('responsible-ai')}
              className="hover:text-teal-300 transition-colors"
            >
              Responsible AI
            </button>
            <button
              onClick={loadDemoIncident}
              className="text-amber-400/90 hover:text-amber-300 transition-colors flex items-center gap-1 font-mono"
            >
              <Sparkles className="w-3 h-3" />
              <span>Try Demo Incident</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-6 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600 text-center sm:text-left">
          <span>
            SAFEFRAME provides documentation support, not legal conclusions or identity verification.
          </span>
          <span>Designed with care for women’s safety & privacy.</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <IncidentProvider>
      <AppContent />
    </IncidentProvider>
  );
}
