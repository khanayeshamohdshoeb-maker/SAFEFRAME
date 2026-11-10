import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { IncidentCategory, EvidenceType } from '../types';
import {
  FileText,
  UploadCloud,
  Image as ImageIcon,
  Clock,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Sparkles,
  Info,
  CheckCircle,
  FileCode,
  ShieldCheck,
} from 'lucide-react';

export const CreateIncidentWizard: React.FC = () => {
  const { createIncident, runAIAnalysis, selectIncident, setActiveView } = useIncidents();

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [approximateTime, setApproximateTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('Unwanted following');
  const [description, setDescription] = useState('');

  // Step 2 Evidence State
  const [evidenceList, setEvidenceList] = useState<
    Array<{
      id: string;
      type: EvidenceType;
      name: string;
      timestamp: string;
      description: string;
      fileSize?: string;
      dataUrl?: string;
    }>
  >([]);

  // Local helper state for adding quick items in Step 2
  const [quickNote, setQuickNote] = useState('');
  const [quickNoteTime, setQuickNoteTime] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);

  const categories: IncidentCategory[] = [
    'Harassment',
    'Unwanted following',
    'Threatening behaviour',
    'Unsafe environment',
    'Online harassment',
    'Other',
  ];

  // Handle local file selection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: EvidenceType) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      const fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setEvidenceList((prev) => [
          ...prev,
          {
            id: `TEMP-EV-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type,
            name: file.name,
            timestamp: timeStr,
            description: '',
            fileSize,
            dataUrl,
          },
        ]);
      };

      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        // For non-image text/doc files
        reader.onload = () => {
          setEvidenceList((prev) => [
            ...prev,
            {
              id: `TEMP-EV-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              type,
              name: file.name,
              timestamp: timeStr,
              description: 'Uploaded document file',
              fileSize,
            },
          ]);
        };
        reader.readAsText(file);
      }
    });

    e.target.value = '';
  };

  const addManualNote = () => {
    if (!quickNote.trim()) return;
    const timeStr = quickNoteTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setEvidenceList((prev) => [
      ...prev,
      {
        id: `TEMP-EV-${Date.now()}`,
        type: 'Text Note',
        name: `Note_${new Date().toISOString().slice(11, 16)}.txt`,
        timestamp: timeStr,
        description: quickNote.trim(),
        fileSize: `${(quickNote.length / 1024).toFixed(2)} KB`,
      },
    ]);
    setQuickNote('');
    setShowNoteForm(false);
  };

  const removeEvidenceItem = (id: string) => {
    setEvidenceList((prev) => prev.filter((item) => item.id !== id));
  };

  const updateEvidenceDescription = (id: string, desc: string) => {
    setEvidenceList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, description: desc } : item))
    );
  };

  // Submit and start AI intelligence
  const handleCreateAndAnalyze = async () => {
    const initialNotes = evidenceList
      .filter((e) => e.type === 'Text Note' && e.description)
      .map((e) => e.description);

    const newInc = createIncident({
      title: title.trim() || `${category} Record`,
      date,
      approximateTime,
      location,
      category,
      description,
      userNotes: initialNotes,
      evidence: evidenceList.map((e, idx) => ({
        id: `EV-${idx + 1}`,
        type: e.type,
        name: e.name,
        timestamp: e.timestamp,
        description: e.description,
        fileSize: e.fileSize,
        dataUrl: e.dataUrl,
        privacyApplied: false,
        redactions: [],
      })),
      timeline: [
        {
          id: `TL-1`,
          time: approximateTime || 'Initial time',
          title: 'User-reported incident observed',
          description: description || 'Initial observation logged into SAFEFRAME.',
          source: 'User-reported',
        },
      ],
    });

    // Run AI analysis
    selectIncident(newInc.id, 'incident-overview');
    await runAIAnalysis(newInc.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Wizard Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>STEP {step} OF 2: {step === 1 ? 'BASIC INCIDENT DETAILS' : 'ATTACH EVIDENCE & MEDIA'}</span>
          <span>SAFE & CONFIDENTIAL</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-teal-400 h-full transition-all duration-300"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>
      </div>

      {step === 1 ? (
        /* STEP 1: Basic Information */
        <div className="space-y-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div>
            <h2 className="text-xl font-bold text-white">Document an Incident</h2>
            <p className="text-xs text-slate-400 mt-1">
              Provide as much or as little context as you remember.
            </p>
          </div>

          {/* Safe reassurance callout */}
          <div className="flex items-start gap-3 p-3.5 bg-teal-950/40 border border-teal-800/40 rounded-xl text-xs text-teal-300">
            <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>You can skip anything you are uncomfortable providing.</strong> You remain in control of what is stored and what is shared.
            </p>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Incident Title (Optional descriptor)
              </label>
              <input
                type="text"
                placeholder="e.g. Unwanted following on campus path, subway harassment..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/60"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors border ${
                      category === cat
                        ? 'bg-teal-950/60 border-teal-500/60 text-teal-300 font-semibold'
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-teal-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Approximate Time
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. 4:35 PM or 5:00 - 5:30 PM"
                    value={approximateTime}
                    onChange={(e) => setApproximateTime(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/60"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Location or Landmark
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Science Library Quad, Corner of 4th & Main, Bus Stop #14"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/60"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                What happened? (Initial observations)
              </label>
              <textarea
                rows={3}
                placeholder="Describe what occurred, any actions you took, direction you moved, or people nearby..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/60"
              />
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveView('dashboard')}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-all flex items-center gap-2"
            >
              <span>Continue to Evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2: Add Evidence */
        <div className="space-y-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div>
            <h2 className="text-xl font-bold text-white">Attach Evidence & Notes</h2>
            <p className="text-xs text-slate-400 mt-1">
              Add photographs, screenshots, observation notes, or timeline milestones. No private metadata is exposed without your consent.
            </p>
          </div>

          {/* Evidence Upload Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Upload Photo */}
            <label className="cursor-pointer p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-teal-500/40 transition-colors flex flex-col items-center justify-center text-center space-y-2">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'Photo')}
              />
              <ImageIcon className="w-5 h-5 text-teal-400" />
              <span className="text-xs font-medium text-slate-200">Upload Photo</span>
            </label>

            {/* Upload Screenshot */}
            <label className="cursor-pointer p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-teal-500/40 transition-colors flex flex-col items-center justify-center text-center space-y-2">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'Screenshot')}
              />
              <UploadCloud className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-medium text-slate-200">Upload Screenshot</span>
            </label>

            {/* Upload Document */}
            <label className="cursor-pointer p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-teal-500/40 transition-colors flex flex-col items-center justify-center text-center space-y-2">
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'Document')}
              />
              <FileText className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-medium text-slate-200">Upload Document</span>
            </label>

            {/* Add Text Note */}
            <button
              type="button"
              onClick={() => setShowNoteForm(true)}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-teal-500/40 transition-colors flex flex-col items-center justify-center text-center space-y-2"
            >
              <FileCode className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-medium text-slate-200">Add Text Note</span>
            </button>
          </div>

          {/* Quick Note Modal / Drawer */}
          {showNoteForm && (
            <div className="p-4 bg-slate-950 border border-slate-700/80 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span>Add Observational Text Note</span>
                <button
                  onClick={() => setShowNoteForm(false)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  ✕
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="Write specific details you recall (clothing color, direction of movement, phrases spoken, etc.)..."
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/60"
              />
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Optional time (e.g. 4:45 PM)"
                  value={quickNoteTime}
                  onChange={(e) => setQuickNoteTime(e.target.value)}
                  className="text-xs px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 w-44"
                />
                <button
                  type="button"
                  onClick={addManualNote}
                  className="px-3 py-1.5 text-xs font-medium bg-teal-500 text-slate-950 rounded-lg hover:bg-teal-400"
                >
                  Attach Note
                </button>
              </div>
            </div>
          )}

          {/* Attached Evidence List */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Attached Evidence ({evidenceList.length})
            </span>

            {evidenceList.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-xs text-slate-500 space-y-1">
                <p>No evidence items attached yet.</p>
                <p className="text-[11px] text-slate-600">
                  (You can also continue without evidence and add items later in the workspace.)
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {evidenceList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {item.dataUrl ? (
                        <img
                          src={item.dataUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover border border-slate-800 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-200 truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono text-teal-400 bg-teal-950/60 px-1.5 py-0.2 rounded border border-teal-800/40">
                            {item.type}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {item.timestamp}
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="Add brief note about this evidence (optional)..."
                          value={item.description}
                          onChange={(e) => updateEvidenceDescription(item.id, e.target.value)}
                          className="w-full text-xs px-2 py-1 bg-slate-900/60 border border-slate-800/80 rounded text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-slate-700"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeEvidenceItem(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Details</span>
            </button>

            <button
              type="button"
              onClick={handleCreateAndAnalyze}
              className="px-6 py-2.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-teal-500/10"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Incident Record</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
