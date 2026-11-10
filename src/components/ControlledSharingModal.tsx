import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { SharePackage } from '../types';
import {
  SlidersHorizontal,
  Lock,
  CheckCircle2,
  X,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlledSharingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { activeIncident, createSharePackage } = useIncidents();

  const [selectedFields, setSelectedFields] = useState({
    summary: true,
    timeline: true,
    evidence: true,
    notes: false,
    location: true,
    dateTime: true,
    privacyProtectedImages: true,
  });

  const [recipientTag, setRecipientTag] = useState('Campus Support & Advocate');
  const [createdPackage, setCreatedPackage] = useState<SharePackage | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !activeIncident) return null;

  const handleToggle = (field: keyof typeof selectedFields) => {
    setSelectedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleCreatePackage = () => {
    const pkg = createSharePackage(activeIncident.id, selectedFields, recipientTag);
    setCreatedPackage(pkg);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/#share=${createdPackage?.id}&digest=${createdPackage?.digestHash}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Controlled Sharing</h2>
              <p className="text-xs text-slate-400">
                You control what leaves SAFEFRAME.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!createdPackage ? (
          /* Selection Step */
          <div className="space-y-5">
            <div className="text-xs text-slate-300">
              Choose the specific information to bundle into this recipient package:
            </div>

            <div className="space-y-2.5">
              {[
                {
                  key: 'summary' as const,
                  label: 'Incident summary',
                  desc: 'Objective, neutral AI-generated summary of events.',
                },
                {
                  key: 'timeline' as const,
                  label: 'Chronological timeline',
                  desc: 'Timestamped milestones establishing sequence.',
                },
                {
                  key: 'evidence' as const,
                  label: 'Selected evidence',
                  desc: 'Photographs, documents, and screenshot catalog.',
                },
                {
                  key: 'privacyProtectedImages' as const,
                  label: 'Privacy-protected images',
                  desc: 'Images with Privacy Shield blur and redaction applied.',
                },
                {
                  key: 'userNotes' as const,
                  label: 'User notes',
                  desc: 'Your contemporaneous personal observational notes.',
                  actualKey: 'notes' as const,
                },
                {
                  key: 'location' as const,
                  label: 'Location details',
                  desc: 'Vicinity, campus landmarks, or transit stop markers.',
                },
                {
                  key: 'dateTime' as const,
                  label: 'Date and time',
                  desc: 'Date of incident and approximate time window.',
                },
              ].map((item) => {
                const targetKey = item.actualKey || item.key;
                const isChecked = selectedFields[targetKey];
                return (
                  <label
                    key={item.key}
                    className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggle(targetKey)}
                      className="mt-0.5 rounded border-slate-700 text-teal-400 focus:ring-teal-400 focus:ring-offset-slate-950"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-slate-200">
                        {item.label}
                      </span>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Recipient / Purpose Tag
              </label>
              <input
                type="text"
                value={recipientTag}
                onChange={(e) => setRecipientTag(e.target.value)}
                placeholder="e.g. Campus Ombudsperson, Legal Counselor, Private Archive"
                className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400">
                NO AUTOMATIC POLICE DISPATCH
              </span>
              <button
                type="button"
                onClick={handleCreatePackage}
                className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-all shadow-md shadow-teal-500/10"
              >
                Create Share Package
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Step: Package Ready */
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-800/60 flex items-start gap-3 text-teal-300">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Share Package Ready</h3>
                <p className="text-xs leading-relaxed text-teal-200">
                  A locked, privacy-bounded package has been created. Only your approved fields will be visible.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500 font-mono">PACKAGE ID</span>
                <span className="font-mono font-semibold text-teal-400">
                  {createdPackage.id}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500 font-mono">RECIPIENT TAG</span>
                <span className="text-slate-200 font-medium">
                  {createdPackage.recipientTag}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500 font-mono">PRIVACY STATUS</span>
                <span className="text-teal-400 font-mono">
                  {createdPackage.selectedFields.privacyProtectedImages
                    ? 'Privacy Shields Enforced'
                    : 'Standard'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500 font-mono">TIMESTAMP</span>
                <span className="text-slate-300 font-mono">
                  {new Date(createdPackage.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-mono">CRYPTOGRAPHIC DIGEST</span>
                <span className="text-slate-400 font-mono text-[10px]">
                  {createdPackage.digestHash}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCreatedPackage(null)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Configure Another Package
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Secure Package Reference'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
