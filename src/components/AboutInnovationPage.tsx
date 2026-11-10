import React from 'react';
import { useIncidents } from '../context/IncidentContext';
import {
  Lightbulb,
  ArrowRight,
  Layers,
  Sparkles,
  Clock,
  EyeOff,
  FileCheck2,
  Building2,
  GraduationCap,
  Globe2,
  Users2,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

export const AboutInnovationPage: React.FC = () => {
  const { setActiveView, loadDemoIncident } = useIncidents();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-teal-300 bg-teal-950/70 border border-teal-800/60 rounded-full font-mono">
          <Lightbulb className="w-3.5 h-3.5 text-teal-400" />
          <span>PRODUCT ARCHITECTURE & CORE INNOVATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          The SAFEFRAME Innovation
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Why women’s safety technology requires a fundamental shift from reactionary panic alarms to structured, privacy-preserving incident intelligence.
        </p>
      </div>

      {/* The Core Shift: Scattered Evidence to Incident Intelligence */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-white">The Structural Paradigm Shift</h2>
          <p className="text-xs text-slate-400 mt-1">
            Comparing the current fragmented reality against the SAFEFRAME workflow.
          </p>
        </div>

        {/* Visual Transformation Chain */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
          {[
            { step: '01', title: 'Scattered Evidence', sub: 'Camera, notes, texts', icon: Layers },
            { step: '02', title: 'AI Understanding', sub: 'Context without identity', icon: Sparkles },
            { step: '03', title: 'Timeline Mapping', sub: 'Chronological sequence', icon: Clock },
            { step: '04', title: 'Privacy Review', sub: 'Bystander redaction', icon: EyeOff },
            { step: '05', title: 'Evidence Pack', sub: 'Controlled dossier', icon: FileCheck2 },
          ].map((item, idx) => (
            <div
              key={item.step}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col items-center justify-between space-y-2 relative"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">{item.title}</h3>
                <p className="text-[11px] text-slate-500">{item.sub}</p>
              </div>
              <span className="text-[10px] font-mono text-teal-400/80">{item.step}</span>
            </div>
          ))}
        </div>

        {/* Deep Dive Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-xl bg-slate-950/60 border border-rose-950/70 space-y-3">
            <h3 className="text-sm font-semibold text-rose-300">Existing Approach (Fragmented)</h3>
            <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✕</span>
                <span>Evidence sits scattered in photo galleries, voice notes, and WhatsApp messages.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✕</span>
                <span>Timestamps are difficult to correlate hours or days after the incident.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✕</span>
                <span>Unrelated bystanders and personal numbers are inadvertently exposed if photos are shared.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✕</span>
                <span>Panic buttons create false alerts without generating credible documentation.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/60 border border-teal-950/70 space-y-3">
            <h3 className="text-sm font-semibold text-teal-300">SAFEFRAME Approach (Intelligent)</h3>
            <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-teal-400">✓</span>
                <span>Unified incident record synthesizing photos, notes, and milestones.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400">✓</span>
                <span>Automatic chronological sequencing with contemporaneous gap detection.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400">✓</span>
                <span>Native Privacy Shield obscuring bystanders before anything leaves your device.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400">✓</span>
                <span>Granular sharing controls: you choose what each recipient sees.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 27: Scalability & Future Scope */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-teal-400">Future Scope</span>
          <h2 className="text-lg font-bold text-white mt-1">
            Scalability & Deployment Horizons
          </h2>
          <p className="text-xs text-slate-400">
            Roadmap for institutional and community integrations (non-speculative design).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Campus Safety Portals',
              desc: 'Students can document incidents and share structured records directly with authorized campus support staff, Title IX offices, or SafeWalk coordinators.',
              icon: GraduationCap,
            },
            {
              title: 'Workplace Safety & HR Compliance',
              desc: 'Employees can organize workplace harassment or hostility incidents with contemporaneous timestamp verification.',
              icon: Building2,
            },
            {
              title: 'Community Safety Organizations',
              desc: 'Civic safety non-profits can accept standardized, privacy-shielded reports to understand unsafe public corridors.',
              icon: Users2,
            },
            {
              title: 'Multilingual Indian Languages',
              desc: 'Expanding natural language incident intake across Hindi, Tamil, Bengali, Telugu, and Marathi to democratize documentation.',
              icon: Globe2,
            },
            {
              title: 'Privacy-Preserving Analytics',
              desc: 'Differential privacy mechanisms allowing municipal planners to identify poorly lit transit hubs without exposing individual victims.',
              icon: BarChart3,
            },
          ].map((scope, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <scope.icon className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{scope.title}</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">{scope.desc}</p>
              <span className="inline-block text-[10px] font-mono text-slate-500">
                [Planned Capability · Roadmap]
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Call to Action */}
      <div className="text-center p-6 bg-slate-900/30 rounded-2xl border border-slate-800/80 space-y-3">
        <h3 className="text-sm font-semibold text-white">
          Experience the innovation in action
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Explore the pre-configured fictional incident demonstrating all 6 stages of the intelligence pipeline.
        </p>
        <button
          onClick={loadDemoIncident}
          className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-colors inline-flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch 30-Second Demo</span>
        </button>
      </div>
    </div>
  );
};
