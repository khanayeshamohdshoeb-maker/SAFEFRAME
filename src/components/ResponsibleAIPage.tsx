import React from 'react';
import { useIncidents } from '../context/IncidentContext';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  PhoneCall,
  Scale,
  EyeOff,
  UserCheck,
  FileCheck2,
} from 'lucide-react';

export const ResponsibleAIPage: React.FC = () => {
  const { setActiveView } = useIncidents();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-amber-300 bg-amber-950/70 border border-amber-800/60 rounded-full font-mono">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>ETHICAL & SAFETY CHARTER</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Responsible AI & Safety Boundaries
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          SAFEFRAME is engineered specifically for respectful documentation support. We adhere to clear ethical guardrails designed to prevent vigilantism, false accusations, and unconsented data leakage.
        </p>
      </div>

      {/* Core Non-Negotiables: What SAFEFRAME Does NOT Do */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Absolute Safety Boundaries</h2>
            <p className="text-xs text-slate-400">
              The platform strictly prohibits and disables the following capabilities:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'No Facial Recognition or Identity Matching',
              desc: 'SAFEFRAME never indexes facial biometrics, runs reverse image searches, or matches individuals across databases.',
            },
            {
              title: 'No Accusations or Criminality Labels',
              desc: 'The platform never declares someone dangerous, guilty, or criminal. All summaries are strictly factual and user-reported.',
            },
            {
              title: 'No Sensitive Characteristic Inferences',
              desc: 'AI models are instructed never to infer race, religion, sexual orientation, health status, or psychological intent.',
            },
            {
              title: 'No Automated Police or 911 Reporting',
              desc: 'We do not broadcast reports to law enforcement without deliberate, manual user review and controlled export.',
            },
            {
              title: 'No Social Media Scraping',
              desc: 'SAFEFRAME does not search or link online profiles, usernames, or handles of any detected individuals.',
            },
            {
              title: 'No Real-time Person Tracking',
              desc: 'We do not support continuous live beacon tracking or surveillance of any target individual.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-rose-950/80 space-y-1.5"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{item.title}</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What SAFEFRAME DOES DO */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">What SAFEFRAME Provides</h2>
            <p className="text-xs text-slate-400">
              Legitimate assistance designed to preserve memories, structure evidence, and protect bystander privacy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Objective Incident Chronology',
              desc: 'Turns scattered time estimates and camera timestamps into an orderly narrative timeline.',
            },
            {
              title: 'Environmental Context Extraction',
              desc: 'Safely notes public lighting, street signs, transit shelters, and physical surroundings.',
            },
            {
              title: 'Interactive Privacy Redaction',
              desc: 'Provides fine-grained controls to blur bystanders, redact phone numbers, and mask addresses before sharing.',
            },
            {
              title: 'User Authority & Controlled Export',
              desc: 'You choose exactly which data fields leave the platform and retain full ownership of every record.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-teal-950/80 space-y-1.5"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{item.title}</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Guidance for Users */}
      <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-4 text-xs text-slate-300 leading-relaxed">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Personal Safety Always Comes First</span>
        </div>
        <p>
          <strong>Never place yourself in danger to collect evidence.</strong> Your physical safety is infinitely more important than capturing photos, recording audio, or documenting an incident.
        </p>
        <p>
          SAFEFRAME does not replace emergency dispatchers, legal counsel, or professional victim support services. If you are in immediate danger, always seek assistance from emergency authorities or trusted community advocates.
        </p>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => setActiveView('dashboard')}
          className="px-6 py-2.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-colors"
        >
          Return to Incident Workspace
        </button>
      </div>
    </div>
  );
};
