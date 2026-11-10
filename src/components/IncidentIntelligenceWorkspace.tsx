import React, { useState } from 'react';
import { useIncidents, AppView } from '../context/IncidentContext';
import { AIAnalysisView } from './AIAnalysisView';
import { TimelineView } from './TimelineView';
import { PrivacyShieldView } from './PrivacyShieldView';
import { WhatChangedView } from './WhatChangedView';
import { EvidenceConnectionsView } from './EvidenceConnectionsView';
import { EvidencePackGenerator } from './EvidencePackGenerator';
import { ControlledSharingModal } from './ControlledSharingModal';
import {
  FileText,
  Clock,
  MapPin,
  Calendar,
  Shield,
  Layers,
  Sparkles,
  GitBranch,
  History,
  Share2,
  Printer,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export const IncidentIntelligenceWorkspace: React.FC = () => {
  const {
    activeIncident,
    setActiveView,
    addEvidence,
    removeEvidence,
    addNote,
    runAIAnalysis,
    isAnalyzing,
  } = useIncidents();

  // Internal workspace sub-tabs
  type WorkspaceTab =
    | 'overview'
    | 'timeline'
    | 'privacy'
    | 'what-changed'
    | 'connections'
    | 'evidence-pack';

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [newNoteInput, setNewNoteInput] = useState('');

  if (!activeIncident) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-white">No active incident selected</h2>
        <button
          onClick={() => setActiveView('dashboard')}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 rounded-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    addNote(activeIncident.id, newNoteInput.trim());
    setNewNoteInput('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready to Share':
        return 'text-teal-400 bg-teal-950/70 border-teal-800/60';
      case 'Ready to Review':
        return 'text-amber-400 bg-amber-950/70 border-amber-800/60';
      case 'Analyzing':
        return 'text-sky-400 bg-sky-950/70 border-sky-800/60';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner if Demo */}
      {activeIncident.isDemo && (
        <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-xl flex items-center justify-between text-xs text-amber-300 font-mono">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>DEMO DATA — NOT A REAL INCIDENT · Safe fictional scenario for evaluation</span>
          </div>
          <span className="hidden sm:inline text-amber-400/80">30-SECOND BENCHMARK</span>
        </div>
      )}

      {/* Incident Header Hub */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-mono font-bold text-teal-400 bg-teal-950/80 border border-teal-800/50 px-2.5 py-0.5 rounded">
                {activeIncident.id}
              </span>
              <span className={`font-mono text-xs px-2 py-0.5 rounded border ${getStatusColor(activeIncident.status)}`}>
                {activeIncident.status}
              </span>
              <span className="text-slate-400 font-medium">{activeIncident.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono">{activeIncident.date}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeIncident.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono pt-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{activeIncident.approximateTime || 'Time unassigned'}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{activeIncident.location || 'Location unassigned'}</span>
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('evidence-pack')}
              className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Dossier / Print</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Controlled Share</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-slate-800/80">
          {[
            { id: 'overview' as const, label: 'Incident Intelligence', icon: Sparkles },
            { id: 'timeline' as const, label: `Timeline (${activeIncident.timeline.length})`, icon: Clock },
            { id: 'privacy' as const, label: 'Privacy Shield', icon: EyeOff },
            { id: 'what-changed' as const, label: 'What Changed?', icon: History },
            { id: 'connections' as const, label: 'Evidence Connections', icon: GitBranch },
            { id: 'evidence-pack' as const, label: 'Evidence Pack', icon: FileText },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-800 text-teal-300 font-semibold border border-teal-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab View Content */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: AI Analysis & Evidence Summary */}
            <div className="lg:col-span-8 space-y-6">
              <AIAnalysisView />

              {/* Evidence Strip */}
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Attached Evidence Items</h3>
                    <p className="text-xs text-slate-400">
                      {activeIncident.evidence.length} item(s) logged in chronological record.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('privacy')}
                    className="text-xs text-teal-400 hover:text-teal-300 font-mono flex items-center gap-1"
                  >
                    <span>Inspect in Privacy Shield</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeIncident.evidence.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => setActiveTab('privacy')}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      {ev.dataUrl ? (
                        <img
                          src={ev.dataUrl}
                          alt={ev.name}
                          className="w-14 h-14 rounded-lg object-cover border border-slate-800 shrink-0 group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-200 truncate">
                            {ev.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {ev.description || 'Evidence item'}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                          <span>{ev.timestamp}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-teal-400">
                            {ev.redactions && ev.redactions.length > 0 ? 'Shielded' : 'Unmasked'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Contemporaneous Notes & Privacy Checklist */}
            <div className="lg:col-span-4 space-y-6">
              {/* Privacy Check Mini Card */}
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-semibold text-teal-400 uppercase tracking-wider">
                    PRIVACY STATUS
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    USER CONTROLLED
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Faces Obscured:</span>
                    <span className="text-teal-400 font-mono">
                      {activeIncident.privacyReview.unrelatedFacesReviewed ? 'Reviewed' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">PII Redacted:</span>
                    <span className="text-teal-400 font-mono">
                      {activeIncident.privacyReview.contactInfoReviewed ? 'Reviewed' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Share Packages:</span>
                    <span className="text-slate-300 font-mono">
                      {activeIncident.sharePackages.length} created
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('privacy')}
                  className="w-full py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Configure Privacy Shield
                </button>
              </div>

              {/* User Notes Card */}
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Contemporaneous Notes</h3>
                  <span className="text-xs font-mono text-slate-500">
                    {activeIncident.userNotes.length}
                  </span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {activeIncident.userNotes.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-3 text-center">
                      No observational notes recorded yet.
                    </p>
                  ) : (
                    activeIncident.userNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed"
                      >
                        {note}
                      </div>
                    ))
                  )}
                </div>

                {/* Add Quick Note */}
                <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder="Add quick observational note..."
                    value={newNoteInput}
                    onChange={(e) => setNewNoteInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && <TimelineView />}
        {activeTab === 'privacy' && <PrivacyShieldView />}
        {activeTab === 'what-changed' && <WhatChangedView />}
        {activeTab === 'connections' && <EvidenceConnectionsView />}
        {activeTab === 'evidence-pack' && <EvidencePackGenerator />}
      </div>

      {/* Controlled Sharing Modal */}
      <ControlledSharingModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
