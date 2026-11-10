import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import {
  Sparkles,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  RefreshCw,
  Edit2,
  Check,
  Shield,
  Layers,
  MapPin,
  Clock,
  Compass,
} from 'lucide-react';

export const AIAnalysisView: React.FC = () => {
  const { activeIncident, isAnalyzing, runAIAnalysis, updateIncident, addNote } = useIncidents();
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  const [gapInputState, setGapInputState] = useState<{ [field: string]: string }>({});
  const [resolvedGaps, setResolvedGaps] = useState<string[]>([]);

  if (!activeIncident) return null;

  const analysis = activeIncident.aiAnalysis;

  const handleStartEditSummary = () => {
    setEditedSummary(analysis?.summary || '');
    setIsEditingSummary(true);
  };

  const handleSaveSummary = () => {
    if (!analysis) return;
    updateIncident(
      activeIncident.id,
      {
        aiAnalysis: {
          ...analysis,
          summary: editedSummary.trim(),
        },
      },
      { updated: ['User refined the AI incident summary'] }
    );
    setIsEditingSummary(false);
  };

  const handleResolveGap = (gapField: string, promptText: string) => {
    const val = gapInputState[gapField]?.trim();
    if (!val) return;

    if (gapField === 'approximateTime') {
      updateIncident(activeIncident.id, { approximateTime: val }, { updated: [`Approximate time specified: ${val}`] });
    } else if (gapField === 'location') {
      updateIncident(activeIncident.id, { location: val }, { updated: [`Location specified: ${val}`] });
    } else {
      addNote(activeIncident.id, `Context added: ${val}`);
    }

    setResolvedGaps((prev) => [...prev, gapField]);
    setGapInputState((prev) => ({ ...prev, [gapField]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Re-run Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">AI Incident Intelligence</h2>
            <p className="text-xs text-slate-400">
              Objective, non-accusatory synthesis from user-supplied evidence.
            </p>
          </div>
        </div>

        <button
          onClick={() => runAIAnalysis(activeIncident.id)}
          disabled={isAnalyzing}
          className="px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-teal-400' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing evidence...' : 'Re-analyze Incident'}</span>
        </button>
      </div>

      {/* Analysis In-Progress Scanning Animation */}
      {isAnalyzing && (
        <div className="p-8 rounded-2xl bg-slate-900/40 border border-teal-500/30 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-teal-500/20 animate-ping" />
            <div className="absolute inset-1 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-teal-400">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">Analyzing incident...</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Extracting safe environmental context, cross-referencing timeline milestones, and checking information completeness.
            </p>
          </div>
          <div className="text-[11px] font-mono text-teal-400/80 bg-teal-950/60 px-3 py-1 rounded border border-teal-800/40">
            ZERO FACIAL RECOGNITION · NO IDENTITY INFERENCES
          </div>
        </div>
      )}

      {/* Primary Results Section */}
      {!isAnalyzing && analysis && (
        <div className="space-y-6">
          {/* Neutral Summary Card */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-teal-400">
                AI Incident Summary
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-mono">
                  {analysis.isSimulated ? 'Simulated AI Analysis' : 'Gemini 3.8 Flash Analysis'}
                </span>
                {!isEditingSummary && (
                  <button
                    onClick={handleStartEditSummary}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>

            {isEditingSummary ? (
              <div className="space-y-3">
                <textarea
                  rows={4}
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  className="w-full text-sm p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsEditingSummary(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSummary}
                    className="px-3 py-1.5 text-xs bg-teal-400 text-slate-950 font-semibold rounded-lg hover:bg-teal-300 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Summary</span>
                  </button>
                </div>
              </div>
            ) : (
              <blockquote className="text-sm sm:text-base text-slate-200 leading-relaxed italic border-l-2 border-teal-500/60 pl-4 py-1">
                “{analysis.summary}”
              </blockquote>
            )}

            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 pt-1">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>AI-generated summary — review before sharing. Does not invent facts.</span>
            </div>
          </div>

          {/* Safe Contextual Information Detected */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Relevant Information Detected</h3>
                <p className="text-xs text-slate-400">
                  Safe, non-sensitive environmental cues extracted from uploaded visuals.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                STRICTLY NON-ACCUSATORY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysis.detectedContext.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/80 flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                    {item.category === 'Environment' && <Compass className="w-4 h-4" />}
                    {item.category === 'Lighting' && <Clock className="w-4 h-4" />}
                    {item.category === 'Landmark' && <MapPin className="w-4 h-4" />}
                    {item.category !== 'Environment' &&
                      item.category !== 'Lighting' &&
                      item.category !== 'Landmark' && <Layers className="w-4 h-4" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-slate-200">{item.label}</h4>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Information Gaps & Optional Clarifications */}
          <div className="space-y-3 pt-2">
            <div>
              <h3 className="text-sm font-semibold text-white">Information Gaps</h3>
              <p className="text-xs text-slate-400">
                Optional sequencing prompts to make your incident record clearer if desired.
              </p>
            </div>

            <div className="space-y-2.5">
              {analysis.informationGaps.map((gap, idx) => {
                const isResolved = resolvedGaps.includes(gap.field);
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-colors ${
                      isResolved
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                        : 'bg-slate-900/40 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        {isResolved ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-slate-200">{gap.prompt}</p>
                          <span className="text-[10px] font-mono text-slate-400">
                            {gap.importance} · Optional Addition
                          </span>
                        </div>
                      </div>
                    </div>

                    {!isResolved && (
                      <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-800/60">
                        <input
                          type="text"
                          placeholder="Type optional clarification..."
                          value={gapInputState[gap.field] || ''}
                          onChange={(e) =>
                            setGapInputState({
                              ...gapInputState,
                              [gap.field]: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleResolveGap(gap.field, gap.prompt)}
                          className="px-3 py-1.5 text-xs font-semibold bg-teal-400 text-slate-950 rounded-lg hover:bg-teal-300 transition-colors"
                        >
                          Add to Record
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
