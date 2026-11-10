import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Incident,
  EvidenceItem,
  TimelineEvent,
  PrivacyRedaction,
  SharePackage,
  PrivacyReviewChecklist,
} from '../types';
import { DEMO_INCIDENT } from '../data/demoIncident';

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'create'
  | 'incident-overview'
  | 'timeline'
  | 'privacy-shield'
  | 'evidence-pack'
  | 'connections'
  | 'what-changed'
  | 'responsible-ai'
  | 'about';

interface IncidentContextType {
  incidents: Incident[];
  activeIncident: Incident | null;
  activeView: AppView;
  isAnalyzing: boolean;
  analysisError: string | null;
  setActiveView: (view: AppView) => void;
  selectIncident: (id: string, view?: AppView) => void;
  loadDemoIncident: () => void;
  createIncident: (draft: Partial<Incident>) => Incident;
  updateIncident: (
    id: string,
    updates: Partial<Incident>,
    changeNote?: { added?: string[]; updated?: string[]; removed?: string[] }
  ) => void;
  deleteIncident: (id: string) => void;
  addEvidence: (incidentId: string, item: Omit<EvidenceItem, 'id'>) => EvidenceItem;
  removeEvidence: (incidentId: string, evidenceId: string) => void;
  updateEvidenceRedactions: (
    incidentId: string,
    evidenceId: string,
    redactions: PrivacyRedaction[]
  ) => void;
  addTimelineEvent: (incidentId: string, event: Omit<TimelineEvent, 'id'>) => void;
  updateTimelineEvent: (
    incidentId: string,
    eventId: string,
    updates: Partial<TimelineEvent>
  ) => void;
  deleteTimelineEvent: (incidentId: string, eventId: string) => void;
  addNote: (incidentId: string, noteText: string) => void;
  runAIAnalysis: (incidentId: string) => Promise<void>;
  createSharePackage: (
    incidentId: string,
    selectedFields: SharePackage['selectedFields'],
    recipientTag?: string
  ) => SharePackage;
  updatePrivacyCheck: (
    incidentId: string,
    checks: Partial<PrivacyReviewChecklist>
  ) => void;
}

const STORAGE_KEY = 'safeframed_incidents_v1';

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return [DEMO_INCIDENT];
  });

  const [activeIncidentId, setActiveIncidentId] = useState<string>(DEMO_INCIDENT.id);
  const [activeView, setActiveView] = useState<AppView>('landing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
    } catch (e) {
      console.warn('Could not persist incidents to localStorage', e);
    }
  }, [incidents]);

  const activeIncident =
    incidents.find((inc) => inc.id === activeIncidentId) || incidents[0] || null;

  const selectIncident = (id: string, view: AppView = 'incident-overview') => {
    setActiveIncidentId(id);
    setActiveView(view);
  };

  const loadDemoIncident = () => {
    setIncidents((prev) => {
      const existing = prev.filter((i) => i.id !== DEMO_INCIDENT.id);
      return [DEMO_INCIDENT, ...existing];
    });
    setActiveIncidentId(DEMO_INCIDENT.id);
    setActiveView('incident-overview');
  };

  const createIncident = (draft: Partial<Incident>): Incident => {
    const count = incidents.length + 1;
    const year = new Date().getFullYear();
    const id = `SF-${year}-${String(count).padStart(5, '0')}`;
    const now = new Date().toISOString();

    const newIncident: Incident = {
      id,
      title: draft.title || 'Untitled Incident Report',
      date: draft.date || new Date().toISOString().split('T')[0],
      approximateTime: draft.approximateTime || '',
      location: draft.location || '',
      category: draft.category || 'Harassment',
      description: draft.description || '',
      status: 'Draft',
      createdAt: now,
      updatedAt: now,
      isDemo: false,
      evidence: draft.evidence || [],
      userNotes: draft.userNotes || [],
      timeline: draft.timeline || [
        {
          id: `TL-${Date.now()}-1`,
          time: draft.approximateTime || 'Initial time',
          title: 'Incident reported in SAFEFRAME',
          description: draft.description || 'Record started by user.',
          source: 'User-reported',
        },
      ],
      privacyReview: {
        unrelatedFacesReviewed: false,
        contactInfoReviewed: false,
        evidenceSelectionReviewed: false,
        locationSharingReviewed: false,
      },
      sharePackages: [],
      changeLogs: [
        {
          timestamp: now,
          addedItems: ['Incident record initialized'],
          updatedItems: [],
          removedItems: [],
        },
      ],
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setActiveIncidentId(id);
    return newIncident;
  };

  const updateIncident = (
    id: string,
    updates: Partial<Incident>,
    changeNote?: { added?: string[]; updated?: string[]; removed?: string[] }
  ) => {
    const now = new Date().toISOString();
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== id) return inc;
        const newLogs = [...inc.changeLogs];
        if (changeNote && (changeNote.added?.length || changeNote.updated?.length || changeNote.removed?.length)) {
          newLogs.unshift({
            timestamp: now,
            addedItems: changeNote.added || [],
            updatedItems: changeNote.updated || [],
            removedItems: changeNote.removed || [],
          });
        }
        return {
          ...inc,
          ...updates,
          updatedAt: now,
          changeLogs: newLogs,
        };
      })
    );
  };

  const deleteIncident = (id: string) => {
    setIncidents((prev) => {
      const filtered = prev.filter((i) => i.id !== id);
      if (activeIncidentId === id) {
        if (filtered.length > 0) {
          setActiveIncidentId(filtered[0].id);
        } else {
          setActiveIncidentId(DEMO_INCIDENT.id);
          return [DEMO_INCIDENT];
        }
      }
      return filtered;
    });
    setActiveView('dashboard');
  };

  const addEvidence = (incidentId: string, item: Omit<EvidenceItem, 'id'>): EvidenceItem => {
    const id = `EV-${Date.now().toString().slice(-4)}`;
    const newItem: EvidenceItem = { ...item, id };
    
    updateIncident(
      incidentId,
      {
        evidence: activeIncident?.id === incidentId
          ? [...activeIncident.evidence, newItem]
          : [...(incidents.find((i) => i.id === incidentId)?.evidence || []), newItem],
        status: 'Draft',
      },
      { added: [`Evidence added: ${newItem.name} (${newItem.type})`] }
    );

    return newItem;
  };

  const removeEvidence = (incidentId: string, evidenceId: string) => {
    const targetInc = incidents.find((i) => i.id === incidentId);
    if (!targetInc) return;
    const removedItem = targetInc.evidence.find((e) => e.id === evidenceId);
    const updatedEvidence = targetInc.evidence.filter((e) => e.id !== evidenceId);
    
    updateIncident(
      incidentId,
      { evidence: updatedEvidence },
      { removed: [`Evidence removed: ${removedItem?.name || evidenceId}`] }
    );
  };

  const updateEvidenceRedactions = (
    incidentId: string,
    evidenceId: string,
    redactions: PrivacyRedaction[]
  ) => {
    const targetInc = incidents.find((i) => i.id === incidentId);
    if (!targetInc) return;
    const updatedEvidence = targetInc.evidence.map((item) => {
      if (item.id === evidenceId) {
        return {
          ...item,
          privacyApplied: true,
          redactions,
        };
      }
      return item;
    });

    updateIncident(
      incidentId,
      { evidence: updatedEvidence },
      { updated: [`Privacy Shield redactions updated on item ${evidenceId}`] }
    );
  };

  const addTimelineEvent = (incidentId: string, event: Omit<TimelineEvent, 'id'>) => {
    const targetInc = incidents.find((i) => i.id === incidentId);
    if (!targetInc) return;
    const newEvent: TimelineEvent = {
      ...event,
      id: `TL-${Date.now().toString().slice(-4)}`,
    };
    
    // Sort timeline chronologically if possible or append
    const updatedTimeline = [...targetInc.timeline, newEvent];

    updateIncident(
      incidentId,
      { timeline: updatedTimeline },
      { added: [`Timeline event: ${newEvent.title} (${newEvent.time})`] }
    );
  };

  const updateTimelineEvent = (
    incidentId: string,
    eventId: string,
    updates: Partial<TimelineEvent>
  ) => {
    const targetInc = incidents.find((i) => i.id === incidentId);
    if (!targetInc) return;
    const updatedTimeline = targetInc.timeline.map((ev) =>
      ev.id === eventId ? { ...ev, ...updates } : ev
    );

    updateIncident(
      incidentId,
      { timeline: updatedTimeline },
      { updated: [`Timeline milestone '${updates.title || eventId}' adjusted`] }
    );
  };

  const deleteTimelineEvent = (incidentId: string, eventId: string) => {
    const targetInc = incidents.find((i) => i.id === incidentId);
    if (!targetInc) return;
    const removedEv = targetInc.timeline.find((t) => t.id === eventId);
    const updatedTimeline = targetInc.timeline.filter((ev) => ev.id !== eventId);

    updateIncident(
      incidentId,
      { timeline: updatedTimeline },
      { removed: [`Timeline event removed: ${removedEv?.title || eventId}`] }
    );
  };

  const addNote = (incidentId: string, noteText: string) => {
    const targetInc = incidents.find((i) => i.id === incidentId);
    if (!targetInc || !noteText.trim()) return;

    updateIncident(
      incidentId,
      { userNotes: [...targetInc.userNotes, noteText.trim()] },
      { added: [`User observational note added`] }
    );
  };

  const updatePrivacyCheck = (
    incidentId: string,
    checks: Partial<PrivacyReviewChecklist>
  ) => {
    const targetInc = incidents.find((i) => i.id === incidentId);
    if (!targetInc) return;
    const newChecklist = {
      ...targetInc.privacyReview,
      ...checks,
    };
    const allChecked =
      newChecklist.unrelatedFacesReviewed &&
      newChecklist.contactInfoReviewed &&
      newChecklist.evidenceSelectionReviewed &&
      newChecklist.locationSharingReviewed;

    updateIncident(incidentId, {
      privacyReview: newChecklist,
      status: allChecked ? 'Ready to Share' : 'Ready to Review',
    });
  };

  const runAIAnalysis = async (incidentId: string) => {
    const targetInc = incidents.find((i) => i.id === incidentId);
    if (!targetInc) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    updateIncident(incidentId, { status: 'Analyzing' });

    try {
      const response = await fetch('/api/analyze-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: targetInc.title,
          date: targetInc.date,
          approximateTime: targetInc.approximateTime,
          location: targetInc.location,
          category: targetInc.category,
          description: targetInc.description,
          notes: targetInc.userNotes,
          evidenceItems: targetInc.evidence.map((e) => ({
            id: e.id,
            name: e.name,
            type: e.type,
            timestamp: e.timestamp,
            description: e.description,
            dataUrl: e.dataUrl,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const now = new Date().toISOString();

      // Merge suggested timeline events if any
      const existingIds = new Set(targetInc.timeline.map((t) => t.id));
      const mergedTimeline = [...targetInc.timeline];

      if (Array.isArray(data.timelineSuggestions)) {
        data.timelineSuggestions.forEach((sug: any, idx: number) => {
          const sugId = `AI-TL-${idx + 1}`;
          if (!existingIds.has(sugId) && !mergedTimeline.some((m) => m.title === sug.title)) {
            mergedTimeline.push({
              id: sugId,
              time: sug.time || targetInc.approximateTime || 'Observed time',
              title: sug.title,
              description: sug.description,
              evidenceRef: sug.evidenceRef,
              source: 'AI-organized',
            });
          }
        });
      }

      const aiResult = {
        summary: data.summary,
        detectedContext: data.detectedContext || [],
        timelineSuggestions: data.timelineSuggestions || [],
        informationGaps: data.informationGaps || [],
        isSimulated: Boolean(data.isSimulated),
        analyzedAt: now,
        notice: data.notice,
      };

      updateIncident(
        incidentId,
        {
          aiAnalysis: aiResult,
          timeline: mergedTimeline,
          status: 'Ready to Review',
        },
        {
          added: [
            'AI Incident Intelligence summary generated',
            'Contextual observations extracted',
          ],
        }
      );
    } catch (err: any) {
      console.error('AI Analysis failed:', err);
      setAnalysisError(err.message || 'Unable to connect to incident intelligence engine.');
      updateIncident(incidentId, { status: 'Draft' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const createSharePackage = (
    incidentId: string,
    selectedFields: SharePackage['selectedFields'],
    recipientTag?: string
  ): SharePackage => {
    const pkgId = `PKG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomHash = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newPkg: SharePackage = {
      id: pkgId,
      createdAt: new Date().toISOString(),
      recipientTag: recipientTag || 'Authorized Support Contact',
      selectedFields,
      digestHash: `sha256-${randomHash}`,
    };

    const targetInc = incidents.find((i) => i.id === incidentId);
    if (targetInc) {
      updateIncident(
        incidentId,
        {
          sharePackages: [newPkg, ...(targetInc.sharePackages || [])],
          status: 'Ready to Share',
        },
        { added: [`Controlled share package ${pkgId} created`] }
      );
    }

    return newPkg;
  };

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        activeIncident,
        activeView,
        isAnalyzing,
        analysisError,
        setActiveView,
        selectIncident,
        loadDemoIncident,
        createIncident,
        updateIncident,
        deleteIncident,
        addEvidence,
        removeEvidence,
        updateEvidenceRedactions,
        addTimelineEvent,
        updateTimelineEvent,
        deleteTimelineEvent,
        addNote,
        runAIAnalysis,
        createSharePackage,
        updatePrivacyCheck,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidents = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
};
