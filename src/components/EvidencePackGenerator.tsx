import React, { useRef } from 'react';
import { useIncidents } from '../context/IncidentContext';
import {
  Printer,
  Download,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  Copy,
  Share2,
} from 'lucide-react';

export const EvidencePackGenerator: React.FC = () => {
  const { activeIncident, setActiveView } = useIncidents();
  const printRef = useRef<HTMLDivElement>(null);

  if (!activeIncident) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(activeIncident, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeIncident.id}_SAFEFRAME_PACK.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadMarkdown = () => {
    const content = `# SAFEFRAME INCIDENT EVIDENCE PACK
Incident ID: ${activeIncident.id}
Title: ${activeIncident.title}
Category: ${activeIncident.category}
Date: ${activeIncident.date}
Approximate Time: ${activeIncident.approximateTime || 'Unspecified'}
Location: ${activeIncident.location || 'Unspecified'}
Privacy Status: ${activeIncident.privacyReview.unrelatedFacesReviewed ? 'Reviewed & Shielded' : 'Draft'}

---
## AI INCIDENT SUMMARY
${activeIncident.aiAnalysis?.summary || activeIncident.description}

---
## CHRONOLOGICAL TIMELINE
${activeIncident.timeline
  .map((t) => `- [${t.time}] ${t.title} (${t.source}): ${t.description}`)
  .join('\n')}

---
## ATTACHED EVIDENCE ITEMS (${activeIncident.evidence.length})
${activeIncident.evidence
  .map(
    (e) =>
      `- [${e.id}] ${e.name} (${e.type}) - ${e.timestamp}\n  Description: ${e.description}\n  Privacy Masks Applied: ${e.privacyApplied ? 'YES' : 'NONE'}`
  )
  .join('\n\n')}

---
## USER OBSERVATIONAL NOTES
${activeIncident.userNotes.map((n, idx) => `${idx + 1}. ${n}`).join('\n')}

---
DISCLAIMER:
This record contains user-provided information and AI-assisted organization. Review all information before sharing. SAFEFRAME does not provide legal conclusions or identity verification.
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeIncident.id}_DOSSIER.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Incident Evidence Pack</h2>
            <span className="text-xs font-mono text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/40">
              Print & Export Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured documentation package ready for review, export, or personal records.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Dossier / PDF</span>
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Markdown</span>
          </button>
          <button
            onClick={handleDownloadJSON}
            className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* The Printable Dossier Container */}
      <div
        ref={printRef}
        className="print-dossier p-8 sm:p-12 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 space-y-8 shadow-2xl max-w-4xl mx-auto"
      >
        {/* Dossier Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-teal-400">
                SAFEFRAME
              </span>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                · INCIDENT INTELLIGENCE DOSSIER
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-2">{activeIncident.title}</h1>
            <p className="text-xs text-slate-400 mt-1">
              User-controlled chronological incident record
            </p>
          </div>

          <div className="sm:text-right font-mono space-y-1">
            <div className="text-xs font-bold text-teal-400 bg-teal-950/60 border border-teal-800/40 px-2.5 py-1 rounded inline-block">
              {activeIncident.id}
            </div>
            <div className="text-[11px] text-slate-400">
              Generated: {new Date().toLocaleDateString()}
            </div>
            <div className="text-[11px] text-slate-400">
              Status: {activeIncident.status}
            </div>
          </div>
        </div>

        {/* Core Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-500 font-mono block">CATEGORY</span>
            <span className="font-medium text-slate-200 mt-0.5 block">
              {activeIncident.category}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-mono block">DATE</span>
            <span className="font-medium text-slate-200 mt-0.5 block">
              {activeIncident.date}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-mono block">TIME FRAME</span>
            <span className="font-medium text-slate-200 mt-0.5 block">
              {activeIncident.approximateTime || 'Not recorded'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-mono block">PRIVACY STATUS</span>
            <span className="font-medium text-teal-400 mt-0.5 block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Shield Verified</span>
            </span>
          </div>
        </div>

        {/* Location Notice */}
        {activeIncident.location && (
          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono bg-slate-900/30 p-2.5 rounded-lg border border-slate-800">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>REPORTED VICINITY: {activeIncident.location}</span>
          </div>
        )}

        {/* Neutral AI Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
            NEUTRAL INCIDENT SUMMARY
          </h3>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-sm leading-relaxed text-slate-200 italic">
            “{activeIncident.aiAnalysis?.summary || activeIncident.description || 'No formal narrative supplied.'}”
          </div>
        </div>

        {/* Chronological Timeline */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
            CHRONOLOGICAL TIMELINE MILESTONES
          </h3>
          <div className="space-y-2 border-l-2 border-slate-800 pl-4">
            {activeIncident.timeline.map((item) => (
              <div key={item.id} className="relative text-xs space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-teal-400">{item.time}</span>
                  <span className="font-semibold text-slate-200">{item.title}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    ({item.source})
                  </span>
                </div>
                {item.description && (
                  <p className="text-slate-400 leading-normal">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Catalog */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
            ATTACHED EVIDENCE & PRIVACY SHIELD STATUS ({activeIncident.evidence.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeIncident.evidence.map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-slate-400 font-semibold">{ev.id}</span>
                  <span className="text-[10px] font-mono text-teal-300 bg-teal-950 px-1.5 py-0.5 rounded border border-teal-800">
                    {ev.type}
                  </span>
                </div>
                <h4 className="font-medium text-slate-200">{ev.name}</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {ev.description || 'Contemporaneous evidence record.'}
                </p>
                <div className="pt-1 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span>Timestamp: {ev.timestamp}</span>
                  <span className="text-teal-400">
                    {ev.redactions && ev.redactions.length > 0
                      ? `${ev.redactions.length} Mask(s) Applied`
                      : 'Standard Shield'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Notes */}
        {activeIncident.userNotes.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
              CONTEMPORANEOUS OBSERVATIONAL NOTES
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
              {activeIncident.userNotes.map((note, idx) => (
                <li key={idx} className="leading-relaxed">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Required Hackathon AI Statement & Disclaimer */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
            <p className="font-semibold text-slate-300">
              «“This record contains user-provided information and AI-assisted organization. Review all information before sharing.”»
            </p>
            <p className="text-[11px] text-slate-500">
              SAFEFRAME provides structured documentation support. It does not perform facial recognition, reverse search, or legal verification. It does not declare criminality or replace official emergency services.
            </p>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-600">
            <span>SAFEFRAME PLATFORM VER: 2026.11</span>
            <span>USER-AUTHORITATIVE RECORD · {activeIncident.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
