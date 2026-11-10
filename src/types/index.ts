export type IncidentCategory =
  | 'Harassment'
  | 'Unwanted following'
  | 'Threatening behaviour'
  | 'Unsafe environment'
  | 'Online harassment'
  | 'Other';

export type IncidentStatus = 'Draft' | 'Analyzing' | 'Ready to Review' | 'Ready to Share';

export type EvidenceType = 'Photo' | 'Screenshot' | 'Document' | 'Text Note' | 'Timeline Event';

export interface PrivacyRedaction {
  id: string;
  type: 'face' | 'text' | 'contact' | 'custom';
  label: string;
  action: 'blur' | 'redact' | 'keep';
  x: number; // percentage 0-100
  y: number;
  width: number;
  height: number;
  reason?: string;
}

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  name: string;
  timestamp: string;
  description: string;
  fileSize?: string;
  dataUrl?: string;
  privacyApplied?: boolean;
  redactions?: PrivacyRedaction[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  evidenceRef?: string;
  source: 'User-reported' | 'AI-organized';
}

export interface DetectedContextItem {
  label: string;
  category: string;
  detail: string;
}

export interface InformationGap {
  prompt: string;
  field: string;
  importance: 'Recommended' | 'Optional';
}

export interface AIAnalysisResult {
  summary: string;
  detectedContext: DetectedContextItem[];
  timelineSuggestions: TimelineEvent[];
  informationGaps: InformationGap[];
  isSimulated: boolean;
  analyzedAt: string;
  notice?: string;
}

export interface PrivacyReviewChecklist {
  unrelatedFacesReviewed: boolean;
  contactInfoReviewed: boolean;
  evidenceSelectionReviewed: boolean;
  locationSharingReviewed: boolean;
}

export interface SharePackage {
  id: string;
  createdAt: string;
  recipientTag?: string;
  selectedFields: {
    summary: boolean;
    timeline: boolean;
    evidence: boolean;
    notes: boolean;
    location: boolean;
    dateTime: boolean;
    privacyProtectedImages: boolean;
  };
  digestHash: string;
}

export interface IncidentChangeLog {
  timestamp: string;
  addedItems: string[];
  updatedItems: string[];
  removedItems: string[];
}

export interface Incident {
  id: string; // e.g. SF-2026-00421
  title: string;
  date: string;
  approximateTime: string;
  location: string;
  category: IncidentCategory;
  description: string;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
  evidence: EvidenceItem[];
  userNotes: string[];
  timeline: TimelineEvent[];
  aiAnalysis?: AIAnalysisResult;
  privacyReview: PrivacyReviewChecklist;
  sharePackages: SharePackage[];
  changeLogs: IncidentChangeLog[];
}
