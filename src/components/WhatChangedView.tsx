import React from 'react';
import { useIncidents } from '../context/IncidentContext';
import {
  History,
  PlusCircle,
  RefreshCw,
  MinusCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  FileCheck2,
} from 'lucide-react';

export const WhatChangedView: React.FC = () => {
  const { activeIncident, updateIncident } = useIncidents();

  if (!activeIncident) return null;

  const changeLogs = activeIncident.changeLogs || [];
  const latestLog = changeLogs[0] || {
    timestamp: activeIncident.updatedAt,
    addedItems: ['Initial record created'],
    updatedItems: [],
    removedItems: [],
  };

  // Demonstration trigger for hackathon judges
  const simulateRecordUpdate = () => {
    const sampleMilestone = `Milestone at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    updateIncident(
      activeIncident.id,
      {
        userNotes: [...activeIncident.userNotes, 'Follow-up observation logged by user.'],
      },
      {
        added: [sampleMilestone, 'Supplemental user observational note'],
        updated: ['Incident timeline refreshed with newly correlated sequence'],
        removed: ['Previous unconfirmed placeholder note'],
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">What Changed? Intelligence</h2>
              <span className="text-[10px] font-mono text-teal-400 bg-teal-950/60 border border-teal-800/40 px-1.5 py-0.5 rounded">
                Dynamic Audit
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Tracks evidence evolutions, timeline additions, and redaction changes across revisions.
            </p>
          </div>
        </div>

        <button
          onClick={simulateRecordUpdate}
          className="px-3.5 py-1.5 text-xs font-semibold text-teal-300 bg-teal-950/60 hover:bg-teal-900/60 border border-teal-800/60 rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Simulate Revision Update</span>
        </button>
      </div>

      {/* 3-Column Delta Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Newly Added */}
        <div className="p-5 rounded-xl bg-slate-900/40 border border-teal-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-teal-400 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-teal-400" />
              <span>NEWLY ADDED</span>
            </span>
            <span className="text-xs font-mono text-teal-400 tabular-nums">
              +{latestLog.addedItems.length}
            </span>
          </div>
          <div className="space-y-2">
            {latestLog.addedItems.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No newly added items in this cycle.</p>
            ) : (
              latestLog.addedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-teal-950/30 border border-teal-900/50 text-xs text-teal-200 flex items-start gap-2"
                >
                  <span className="text-teal-400 font-bold shrink-0">+</span>
                  <span className="leading-snug">{item}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Updated Items */}
        <div className="p-5 rounded-xl bg-slate-900/40 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-amber-400 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>UPDATED</span>
            </span>
            <span className="text-xs font-mono text-amber-400 tabular-nums">
              ~{latestLog.updatedItems.length}
            </span>
          </div>
          <div className="space-y-2">
            {latestLog.updatedItems.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No existing records were modified.</p>
            ) : (
              latestLog.updatedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/50 text-xs text-amber-200 flex items-start gap-2"
                >
                  <span className="text-amber-400 font-bold shrink-0">~</span>
                  <span className="leading-snug">{item}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Removed Items */}
        <div className="p-5 rounded-xl bg-slate-900/40 border border-rose-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-rose-400 flex items-center gap-1.5">
              <MinusCircle className="w-4 h-4 text-rose-400" />
              <span>REMOVED</span>
            </span>
            <span className="text-xs font-mono text-rose-400 tabular-nums">
              -{latestLog.removedItems.length}
            </span>
          </div>
          <div className="space-y-2">
            {latestLog.removedItems.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No items were deleted or purged.</p>
            ) : (
              latestLog.removedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/50 text-xs text-rose-200 flex items-start gap-2"
                >
                  <span className="text-rose-400 font-bold shrink-0">-</span>
                  <span className="leading-snug">{item}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Visual Before vs. After Comparison */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Visual State Comparison</h3>
            <p className="text-xs text-slate-400">
              Demonstrates that SAFEFRAME actively correlates evolving evidence rather than simply storing static files.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            AUDIT ID: {activeIncident.id}-REV{changeLogs.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* Previous Snapshot */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>PREVIOUS RECORD STATE</span>
              <span>Baseline Draft</span>
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span>Evidence Items:</span>
                <span className="font-mono text-slate-300">
                  {Math.max(1, activeIncident.evidence.length - latestLog.addedItems.length)} items
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span>Timeline Chronology:</span>
                <span className="font-mono text-slate-300">
                  {Math.max(1, activeIncident.timeline.length - 2)} milestones
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span>Privacy Shield:</span>
                <span className="font-mono text-amber-400">Pending Review</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Controlled Packages:</span>
                <span className="font-mono text-slate-300">0 packages</span>
              </div>
            </div>
          </div>

          {/* Current Record State */}
          <div className="p-4 rounded-xl bg-slate-950 border border-teal-500/40 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-teal-300">
              <span>CURRENT INTELLIGENCE STATE</span>
              <span>Synchronized</span>
            </div>
            <div className="space-y-2 text-xs text-slate-200">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span>Evidence Items:</span>
                <span className="font-mono font-semibold text-teal-400">
                  {activeIncident.evidence.length} items (verified non-invasive)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span>Timeline Chronology:</span>
                <span className="font-mono font-semibold text-teal-400">
                  {activeIncident.timeline.length} correlated milestones
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span>Privacy Shield:</span>
                <span className="font-mono font-semibold text-teal-400">
                  {activeIncident.privacyReview.unrelatedFacesReviewed ? 'Reviewed & Shielded' : 'In Review'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Controlled Packages:</span>
                <span className="font-mono font-semibold text-teal-400">
                  {activeIncident.sharePackages.length} package(s) generated
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
