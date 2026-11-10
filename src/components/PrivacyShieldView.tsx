import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { PrivacyRedaction, EvidenceItem } from '../types';
import {
  EyeOff,
  Eye,
  CheckCircle2,
  Shield,
  Layers,
  Undo2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info,
  Maximize2,
  Lock,
} from 'lucide-react';

export const PrivacyShieldView: React.FC = () => {
  const { activeIncident, updateEvidenceRedactions, updatePrivacyCheck } = useIncidents();

  if (!activeIncident) return null;

  // Selected evidence item to edit in Privacy Shield
  const photoEvidence = activeIncident.evidence.filter(
    (e) => e.type === 'Photo' || e.type === 'Screenshot'
  );
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(
    photoEvidence[0]?.id || activeIncident.evidence[0]?.id || ''
  );

  const [viewMode, setViewMode] = useState<'protected' | 'original'>('protected');
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);

  const selectedEvidence = activeIncident.evidence.find(
    (e) => e.id === selectedEvidenceId
  );

  const currentRedactions: PrivacyRedaction[] = selectedEvidence?.redactions || [];

  const handleUpdateAction = (
    redactionId: string,
    action: 'blur' | 'redact' | 'keep'
  ) => {
    if (!selectedEvidence) return;
    const updated = currentRedactions.map((r) =>
      r.id === redactionId ? { ...r, action } : r
    );
    updateEvidenceRedactions(activeIncident.id, selectedEvidence.id, updated);
  };

  const handleAddCustomZone = () => {
    if (!selectedEvidence) return;
    const newZone: PrivacyRedaction = {
      id: `custom-${Date.now()}`,
      type: 'custom',
      label: 'Manual Redaction Zone',
      action: 'redact',
      x: 35,
      y: 35,
      width: 25,
      height: 20,
      reason: 'User-specified privacy protection area.',
    };
    updateEvidenceRedactions(activeIncident.id, selectedEvidence.id, [
      ...currentRedactions,
      newZone,
    ]);
    setActiveZoneId(newZone.id);
  };

  const handleResetZones = () => {
    if (!selectedEvidence) return;
    updateEvidenceRedactions(activeIncident.id, selectedEvidence.id, []);
    setActiveZoneId(null);
  };

  const { privacyReview } = activeIncident;
  const allChecksComplete =
    privacyReview.unrelatedFacesReviewed &&
    privacyReview.contactInfoReviewed &&
    privacyReview.evidenceSelectionReviewed &&
    privacyReview.locationSharingReviewed;

  return (
    <div className="space-y-8">
      {/* Privacy Shield Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">
              Protect Private Information Before Sharing
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Review and redact bystanders, phone numbers, addresses, and extraneous identifying details.
            </p>
          </div>
        </div>

        {/* Before / After Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('protected')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'protected'
                ? 'bg-amber-400/20 text-amber-300 font-semibold border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy Protected</span>
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'original'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Original Source</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Workspace: Evidence Canvas vs Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Canvas & Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Evidence Selector Tabs if multiple items */}
          {activeIncident.evidence.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {activeIncident.evidence.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedEvidenceId(item.id);
                    setActiveZoneId(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
                    selectedEvidenceId === item.id
                      ? 'bg-slate-800 text-teal-300 border-teal-500/40 font-semibold'
                      : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {item.id}: {item.name}
                </button>
              ))}
            </div>
          )}

          {/* Interactive Image Box */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[4/3] flex items-center justify-center group shadow-xl">
            {selectedEvidence?.dataUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={selectedEvidence.dataUrl}
                  alt={selectedEvidence.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none"
                />

                {/* Privacy Overlay Layers */}
                {viewMode === 'protected' &&
                  currentRedactions.map((zone) => {
                    if (zone.action === 'keep') return null;

                    const isSelected = activeZoneId === zone.id;

                    return (
                      <div
                        key={zone.id}
                        onClick={() => setActiveZoneId(zone.id)}
                        style={{
                          left: `${zone.x}%`,
                          top: `${zone.y}%`,
                          width: `${zone.width}%`,
                          height: `${zone.height}%`,
                        }}
                        className={`absolute cursor-pointer transition-all ${
                          zone.action === 'blur'
                            ? 'backdrop-blur-xl bg-slate-900/40 border-2 border-teal-400/80'
                            : 'bg-black/95 border-2 border-amber-400 flex items-center justify-center text-[10px] font-mono text-amber-300 tracking-wider font-bold'
                        } ${isSelected ? 'ring-2 ring-white scale-[1.02]' : 'hover:scale-[1.01]'}`}
                        title={`${zone.label} (${zone.action.toUpperCase()})`}
                      >
                        {zone.action === 'redact' && (
                          <span className="select-none px-1">REDACTED</span>
                        )}
                        {zone.action === 'blur' && (
                          <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-teal-950/80 text-teal-300 px-1 rounded">
                            BLUR
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="p-8 text-center space-y-2 text-slate-500">
                <Layers className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">No image asset available for this evidence item.</p>
                <p className="text-[11px] text-slate-600">
                  Select a photographic or screenshot item to view privacy overlay.
                </p>
              </div>
            )}

            {/* Mode Banner */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono border border-slate-800 text-slate-300">
              {viewMode === 'protected'
                ? 'PROTECTED PREVIEW (REDACTIONS APPLIED)'
                : 'ORIGINAL SOURCE PREVIEW (NO MASKS)'}
            </div>
          </div>

          {/* Transparent prototype limitation statement */}
          <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Interactive Redaction Engine:</strong> Redaction masks are rendered client-side on the image canvas. In accordance with SAFEFRAME safety boundaries, the app does not claim automated recognition infallibility; please manually inspect all blurred regions before export.
            </p>
          </div>
        </div>

        {/* Right Column: Detected Zones & Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Redaction Controls Box */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Detected Privacy Items</h3>
                <p className="text-xs text-slate-400">
                  Select an item to change redaction treatment.
                </p>
              </div>
              <button
                onClick={handleAddCustomZone}
                className="text-xs text-teal-400 hover:text-teal-300 font-mono flex items-center gap-1"
              >
                + Add Custom Box
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {currentRedactions.length === 0 ? (
                <div className="p-4 text-center border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
                  No privacy masks added to this file yet.
                </div>
              ) : (
                currentRedactions.map((zone) => {
                  const isSelected = activeZoneId === zone.id;
                  return (
                    <div
                      key={zone.id}
                      onClick={() => setActiveZoneId(zone.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-slate-950 border-teal-500/60 ring-1 ring-teal-500/40'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{zone.label}</span>
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                            zone.action === 'blur'
                              ? 'text-teal-300 bg-teal-950/80 border border-teal-800/60'
                              : zone.action === 'redact'
                              ? 'text-amber-300 bg-amber-950/80 border border-amber-800/60'
                              : 'text-slate-400 bg-slate-800/80'
                          }`}
                        >
                          {zone.action.toUpperCase()}
                        </span>
                      </div>

                      {zone.reason && (
                        <p className="text-[11px] text-slate-400 leading-normal">
                          {zone.reason}
                        </p>
                      )}

                      {/* Redaction Action Toggle Buttons */}
                      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/60">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateAction(zone.id, 'blur');
                          }}
                          className={`flex-1 py-1 text-[11px] font-medium rounded transition-colors ${
                            zone.action === 'blur'
                              ? 'bg-teal-500 text-slate-950 font-semibold'
                              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          Blur
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateAction(zone.id, 'redact');
                          }}
                          className={`flex-1 py-1 text-[11px] font-medium rounded transition-colors ${
                            zone.action === 'redact'
                              ? 'bg-amber-400 text-slate-950 font-semibold'
                              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          Redact
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateAction(zone.id, 'keep');
                          }}
                          className={`flex-1 py-1 text-[11px] font-medium rounded transition-colors ${
                            zone.action === 'keep'
                              ? 'bg-slate-700 text-white font-semibold'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          Keep
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {currentRedactions.length > 0 && (
              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={handleResetZones}
                  className="text-xs text-slate-400 hover:text-rose-400 font-mono flex items-center gap-1"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Reset All Masks</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 12: Privacy Check Panel */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Privacy Check</h3>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  allChecksComplete
                    ? 'text-teal-300 bg-teal-950/70 border-teal-800/60'
                    : 'text-amber-400 bg-amber-950/70 border-amber-800/60'
                }`}
              >
                {allChecksComplete ? 'Ready for your review' : 'Review in Progress'}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Confirm each protection layer prior to generating an external Evidence Pack.
            </p>

            <div className="space-y-2.5">
              {[
                {
                  id: 'unrelatedFacesReviewed',
                  label: 'Unrelated faces reviewed',
                  desc: 'Bystander faces obscured or blurred.',
                },
                {
                  id: 'contactInfoReviewed',
                  label: 'Contact information reviewed',
                  desc: 'Personal phone numbers, emails, and flyers masked.',
                },
                {
                  id: 'evidenceSelectionReviewed',
                  label: 'Evidence selection reviewed',
                  desc: 'Only relevant photographs and contemporaneous notes included.',
                },
                {
                  id: 'locationSharingReviewed',
                  label: 'Location sharing reviewed',
                  desc: 'General vicinity approved without revealing private residence.',
                },
              ].map((item) => {
                const isChecked = Boolean(
                  (privacyReview as any)[item.id]
                );
                return (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        updatePrivacyCheck(activeIncident.id, {
                          [item.id]: e.target.checked,
                        })
                      }
                      className="mt-0.5 rounded border-slate-700 text-teal-500 focus:ring-teal-400 focus:ring-offset-slate-950"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-medium text-slate-200">{item.label}</span>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 font-mono leading-normal">
              * SAFEFRAME does not guarantee automated anonymity. You verify and decide what leaves your device.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
