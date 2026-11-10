import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import {
  Layers,
  ArrowRight,
  Clock,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Link2,
  CheckCircle2,
  GitBranch,
} from 'lucide-react';

export const EvidenceConnectionsView: React.FC = () => {
  const { activeIncident } = useIncidents();
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);

  if (!activeIncident) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Evidence Relationship Graph</h2>
            <p className="text-xs text-slate-400">
              Demonstrates how SAFEFRAME synthesizes fragments into structured intelligence.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/40">
          INTELLIGENCE SYNTHESIS
        </span>
      </div>

      {/* Explanatory Banner */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
        <Link2 className="w-4 h-4 text-teal-400 shrink-0" />
        <span>
          Click on any evidence item to trace its lineage through chronological timestamps, narrative milestones, and the final incident summary.
        </span>
      </div>

      {/* Visual Relationship Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
        {/* Column 1: Raw Evidence Items */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-teal-400 font-semibold border-b border-slate-800 pb-2">
            <span>01 RAW EVIDENCE</span>
            <span>{activeIncident.evidence.length}</span>
          </div>

          <div className="space-y-2">
            {activeIncident.evidence.map((ev) => {
              const isSelected = highlightedItem === ev.id;
              return (
                <div
                  key={ev.id}
                  onClick={() => setHighlightedItem(isSelected ? null : ev.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-950/50 border-teal-500/70 shadow-md ring-1 ring-teal-400'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {ev.type === 'Photo' ? (
                      <ImageIcon className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    )}
                    <span className="text-xs font-medium text-slate-200 truncate">
                      {ev.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-slate-500">
                    <span>{ev.id}</span>
                    <span>{ev.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Correlated Milestones */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-teal-400 font-semibold border-b border-slate-800 pb-2">
            <span>02 CHRONOLOGY</span>
            <span>{activeIncident.timeline.length}</span>
          </div>

          <div className="space-y-2">
            {activeIncident.timeline.map((tl) => {
              const isLinked = highlightedItem && tl.evidenceRef === highlightedItem;
              return (
                <div
                  key={tl.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isLinked
                      ? 'bg-teal-950/60 border-teal-400 ring-1 ring-teal-400'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-teal-300 font-semibold">{tl.time}</span>
                    <span className="text-[10px] text-slate-500">{tl.source}</span>
                  </div>
                  <h4 className="text-xs font-medium text-slate-200 mt-1 truncate">
                    {tl.title}
                  </h4>
                  {tl.evidenceRef && (
                    <span className="inline-block mt-1 text-[9px] font-mono text-teal-400 bg-teal-950/80 px-1 rounded">
                      Linked: {tl.evidenceRef}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Observational Notes */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-teal-400 font-semibold border-b border-slate-800 pb-2">
            <span>03 USER NOTES</span>
            <span>{activeIncident.userNotes.length}</span>
          </div>

          <div className="space-y-2">
            {activeIncident.userNotes.map((note, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed"
              >
                <div className="text-[10px] font-mono text-slate-500 mb-1">
                  OBSERVATION #{idx + 1}
                </div>
                <p className="line-clamp-3">{note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Column 4: Synthesized Dossier */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-teal-500/30 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-teal-400 font-semibold border-b border-slate-800 pb-2">
              <span>04 SYNTHESIZED RECORD</span>
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            </div>

            <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-teal-800/40 space-y-2">
              <span className="text-[11px] font-mono font-semibold text-teal-300">
                AI INCIDENT RECORD
              </span>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                “{activeIncident.aiAnalysis?.summary || activeIncident.description}”
              </p>
              <div className="pt-2 text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-teal-400" />
                <span>Audited for Privacy & Sequence</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-teal-950/30 border border-teal-900/50 text-[11px] text-teal-300 text-center">
            Evidence is contextualized, never isolated.
          </div>
        </div>
      </div>
    </div>
  );
};
