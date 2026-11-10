import React from 'react';
import { useIncidents } from '../context/IncidentContext';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  EyeOff,
  Layers,
  FileCheck2,
  Clock,
  Lock,
  ChevronRight,
  AlertCircle,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, loadDemoIncident } = useIncidents();

  return (
    <div className="space-y-24 py-10">
      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-teal-300 bg-teal-950/70 border border-teal-800/60 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Incident Intelligence & Privacy Protection Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight text-balance">
          Turn scattered evidence into a clear incident record.
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed text-balance">
          SAFEFRAME uses AI to organize incident information, protect privacy, and create a structured record that you can review and share on your terms.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActiveView('create')}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Create an Incident</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={loadDemoIncident}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-medium text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex items-center justify-center gap-2 transition-all hover:text-white"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Try Demo Incident</span>
          </button>
        </div>

        {/* Core Statement Callout */}
        <div className="pt-6">
          <p className="text-xs text-slate-400 font-mono tracking-wide">
            “AI helps organize what happened. You remain in control of what gets shared.”
          </p>
        </div>
      </section>

      {/* 5-Step Visual Flow */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-400">Core Workflow</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              From Fragmented Evidence to Verifiable Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Collect',
                desc: 'Upload photos, screenshots, notes, & timeline milestones.',
                icon: Layers,
              },
              {
                step: '02',
                title: 'Understand',
                desc: 'Extract safe non-sensitive environmental & physical context.',
                icon: Sparkles,
              },
              {
                step: '03',
                title: 'Organize',
                desc: 'Chronological timeline mapping with clear evidence links.',
                icon: Clock,
              },
              {
                step: '04',
                title: 'Protect',
                desc: 'Interactive Privacy Shield to blur bystanders & redact PII.',
                icon: EyeOff,
              },
              {
                step: '05',
                title: 'Share',
                desc: 'Fine-grained controlled export packages on your terms.',
                icon: SlidersHorizontal,
              },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="relative p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-teal-400 font-semibold">{item.step}</span>
                  <item.icon className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-normal">{item.desc}</p>
                </div>
                {idx < 4 && (
                  <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Core Value Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-mono uppercase tracking-wider text-teal-400">Guiding Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Designed for Rigor, Safety & Privacy</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">AI Incident Intelligence</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Turn unstructured information into a clear incident summary and timeline. Automatically identify gaps in sequence without guessing identity or inferring intent.
            </p>
            <div className="pt-2 text-xs text-slate-400 font-mono flex items-center gap-2">
              <span>Non-accusatory</span>
              <span aria-hidden="true">·</span>
              <span>Context extraction</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Privacy First</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Protect unrelated people and private information before sharing. Native Privacy Shield allows interactive blur and redaction of bystanders, phones, and addresses.
            </p>
            <div className="pt-2 text-xs text-slate-400 font-mono flex items-center gap-2">
              <span>Zero facial recognition</span>
              <span aria-hidden="true">·</span>
              <span>Bystander blur</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">User Controlled</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Choose exactly what belongs in your final incident package. No automatic police transmission, no forced social media scraping, and no unapproved metadata sharing.
            </p>
            <div className="pt-2 text-xs text-slate-400 font-mono flex items-center gap-2">
              <span>Selective sharing</span>
              <span aria-hidden="true">·</span>
              <span>Granular checkboxes</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Real-World Innovation: Scattered Evidence vs SAFEFRAME */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-400">The Problem & The Shift</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Why safety evidence remains so vulnerable today
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              During a stressful safety incident, information is naturally fragmented: a quick phone snapshot, a message to a friend, disjointed timestamp notes, approximate memory.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Later, retelling what occurred or providing documentation to a counselor, ombudsperson, or safety office is overwhelming. Traditional apps offer panic buttons or invasive facial recognition. SAFEFRAME provides respectful documentation intelligence.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setActiveView('about')}
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Read detailed innovation architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Visual Transformation Matrix */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-rose-400 font-mono">
                <span>BEFORE SAFEFRAME</span>
                <span>Scattered & Incoherent</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-400">
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">Phone Gallery</div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">Chat Messages</div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">Voice Memos</div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 text-xs font-bold">
                ↓
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-teal-400 font-mono">
                <span>WITH SAFEFRAME</span>
                <span>Structured Incident Intelligence</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/90 border border-teal-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Chronological Dossier</span>
                  <span className="text-teal-400 font-mono">Privacy Shielded</span>
                </div>
                <p className="text-xs text-slate-400">
                  Verified timestamps, neutral contextual observations, redaction receipts, and selective sharing packages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible AI Statement Footer Callout */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-200">Responsible AI Commitment</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              SAFEFRAME provides documentation support, not legal conclusions or identity verification. We never perform facial recognition, track individuals, or declare criminality. The user retains complete authority over every record.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
