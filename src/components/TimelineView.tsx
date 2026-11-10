import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { TimelineEvent } from '../types';
import {
  Clock,
  PlusCircle,
  Edit2,
  Trash2,
  Check,
  X,
  FileText,
  Image as ImageIcon,
  Sparkles,
  User,
  ArrowUpDown,
} from 'lucide-react';

export const TimelineView: React.FC = () => {
  const { activeIncident, addTimelineEvent, updateTimelineEvent, deleteTimelineEvent } =
    useIncidents();

  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newEvidenceRef, setNewEvidenceRef] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTime, setEditTime] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  if (!activeIncident) return null;

  const timeline = activeIncident.timeline || [];

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTime.trim()) return;

    addTimelineEvent(activeIncident.id, {
      time: newTime.trim(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      evidenceRef: newEvidenceRef || undefined,
      source: 'User-reported',
    });

    setNewTime('');
    setNewTitle('');
    setNewDesc('');
    setNewEvidenceRef('');
    setIsAdding(false);
  };

  const startEdit = (ev: TimelineEvent) => {
    setEditingId(ev.id);
    setEditTime(ev.time);
    setEditTitle(ev.title);
    setEditDesc(ev.description);
  };

  const saveEdit = (id: string) => {
    updateTimelineEvent(activeIncident.id, id, {
      time: editTime.trim(),
      title: editTitle.trim(),
      description: editDesc.trim(),
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Timeline Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Chronological Incident Timeline</h2>
            <span className="text-xs font-mono text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/40">
              {timeline.length} Milestones
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured chronology establishing sequence, contemporaneous notes, and evidence timestamps.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Timeline Milestone</span>
        </button>
      </div>

      {/* Add New Milestone Card */}
      {isAdding && (
        <form
          onSubmit={handleCreateEvent}
          className="p-5 rounded-2xl bg-slate-900/80 border border-teal-500/40 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-teal-300">
              ADD NEW TIMELINE EVENT
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Timestamp
              </label>
              <input
                type="text"
                placeholder="e.g. 4:48 PM"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                required
                className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Event Title
              </label>
              <input
                type="text"
                placeholder="e.g. Changed direction to opposite side of road"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description & Context
            </label>
            <textarea
              rows={2}
              placeholder="What occurred, actions taken, or observations made..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>

          {activeIncident.evidence.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Attach Related Evidence (Optional)
              </label>
              <select
                value={newEvidenceRef}
                onChange={(e) => setNewEvidenceRef(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-teal-500"
              >
                <option value="">None (Independent Milestone)</option>
                {activeIncident.evidence.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.id} — {ev.name} ({ev.type})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-teal-400 text-slate-950 rounded-lg hover:bg-teal-300"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Visual Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {timeline.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
            No chronological milestones yet. Add milestones manually or generate them using AI analysis.
          </div>
        ) : (
          timeline.map((event, index) => {
            const isEditing = editingId === event.id;
            const linkedEvidence = activeIncident.evidence.find(
              (e) => e.id === event.evidenceRef
            );

            return (
              <div key={event.id} className="relative group">
                {/* Node icon marker */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    event.source === 'AI-organized'
                      ? 'bg-teal-950 text-teal-400 border border-teal-500/50'
                      : 'bg-slate-900 text-slate-300 border border-slate-700'
                  }`}
                >
                  {event.source === 'AI-organized' ? (
                    <Sparkles className="w-3 h-3 text-teal-400" />
                  ) : (
                    <Clock className="w-3 h-3 text-slate-400" />
                  )}
                </div>

                {/* Milestone Card */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                          className="px-2.5 py-1 text-xs bg-slate-950 border border-slate-700 rounded text-slate-100"
                          placeholder="Timestamp"
                        />
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="sm:col-span-2 px-2.5 py-1 text-xs bg-slate-950 border border-slate-700 rounded text-slate-100"
                          placeholder="Milestone title"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full p-2 text-xs bg-slate-950 border border-slate-700 rounded text-slate-100"
                        placeholder="Description"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => saveEdit(event.id)}
                          className="px-3 py-1 text-xs bg-teal-400 text-slate-950 font-semibold rounded hover:bg-teal-300"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-teal-400 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
                            {event.time}
                          </span>
                          <h3 className="text-sm font-semibold text-white">{event.title}</h3>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                              event.source === 'AI-organized'
                                ? 'text-teal-300 bg-teal-950/60 border-teal-800/60'
                                : 'text-slate-400 bg-slate-800/60 border-slate-700/60'
                            }`}
                          >
                            {event.source}
                          </span>

                          <button
                            onClick={() => startEdit(event)}
                            className="p-1 text-slate-500 hover:text-slate-300 rounded"
                            title="Edit milestone"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => deleteTimelineEvent(activeIncident.id, event.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded"
                            title="Delete milestone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {event.description && (
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {event.description}
                        </p>
                      )}

                      {/* Linked Evidence Preview pill/card */}
                      {linkedEvidence && (
                        <div className="mt-2 pt-2 border-t border-slate-800/70 flex items-center gap-3 text-xs">
                          <span className="text-[11px] font-mono text-slate-500">
                            LINKED EVIDENCE:
                          </span>
                          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                            {linkedEvidence.type === 'Photo' ? (
                              <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                            ) : (
                              <FileText className="w-3.5 h-3.5 text-sky-400" />
                            )}
                            <span className="text-xs font-medium text-slate-300">
                              {linkedEvidence.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              ({linkedEvidence.id})
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
