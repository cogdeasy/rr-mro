export interface VarianceRequest {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  anomalyType: string;
  engineType: string;
  engineSerialNumber: string;
  partNumber: string | null;
  aircraftRegistration: string | null;
  status: RequestStatus;
  priority: Priority;
  submittedBy: string;
  assignedTo: string | null;
  mroOrganisation: string;
  mroSiteLocation: string | null;
  shopVisitReference: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  attachments: Attachment[];
  comments: Comment[];
  auditTrail: AuditEntry[];
  triageResult: TriageResult | null;
  generatedDocument: VarianceDocument | null;
}

export interface VarianceRequestSummary {
  id: string;
  referenceNumber: string;
  title: string;
  anomalyType: string;
  engineType: string;
  status: string;
  priority: string;
  mroOrganisation: string;
  submittedBy: string;
  assignedTo: string | null;
  attachmentCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  blobUrl: string;
  description: string | null;
  category: string;
  requestId: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  authorRole: string;
  isInternal: boolean;
  requestId: string;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  details: string;
  actor: string;
  actorRole: string | null;
  previousValue: string | null;
  newValue: string | null;
  requestId: string;
  createdAt: string;
}

export interface TriageResult {
  id: string;
  requestId: string;
  severityClassification: string;
  recommendedAction: string;
  suggestedSpecialist: string | null;
  confidenceScore: number;
  similarVariancesFound: number;
  matchedReferenceIds: string[];
  aiModelVersion: string | null;
  ragContextSummary: string | null;
  suggestedRfiQuestions: string[];
  triagedAt: string;
}

export interface VarianceDocument {
  id: string;
  requestId: string;
  documentNumber: string;
  title: string;
  status: string;
  version: number;
  problemStatement: string | null;
  technicalAnalysis: string | null;
  safetyAssessment: string | null;
  proposedDisposition: string | null;
  regulatoryReferences: string | null;
  specialistRecommendation: string | null;
  applicableRegulations: string | null;
  aiGeneratedPercentage: number;
  authoredBy: string | null;
  reviewedBy: string | null;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  signatures: DocumentSignature[];
}

export interface DocumentSignature {
  id: string;
  documentId: string;
  signatoryName: string;
  signatoryRole: string;
  digitalSignatureHash: string | null;
  signedAt: string | null;
}

export interface DashboardStats {
  totalRequests: number;
  submitted: number;
  underReview: number;
  triageComplete: number;
  specialistOpinion: number;
  recommendationDrafted: number;
  documentAuthored: number;
  completed: number;
  avgResolutionDays: number;
  byEngineType: Record<string, number>;
  byMroOrganisation: Record<string, number>;
  byPriority: Record<string, number>;
  monthlyTrend: MonthlyTrend[];
}

export interface MonthlyTrend {
  month: string;
  submitted: number;
  resolved: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export type RequestStatus =
  | 'Submitted' | 'UnderReview' | 'TriageComplete'
  | 'SpecialistOpinion' | 'RecommendationDrafted' | 'DocumentAuthored'
  | 'Approved' | 'Completed' | 'Closed' | 'Rejected';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export const STATUS_LABELS: Record<string, string> = {
  Submitted: 'Submitted',
  UnderReview: 'Under Review',
  TriageComplete: 'Triage Complete',
  SpecialistOpinion: 'Specialist Opinion',
  RecommendationDrafted: 'Recommendation Drafted',
  DocumentAuthored: 'Document Authored',
  Approved: 'Approved',
  Completed: 'Completed',
  Closed: 'Closed',
  Rejected: 'Rejected'
};

export const STATUS_CSS: Record<string, string> = {
  Submitted: 'submitted',
  UnderReview: 'under-review',
  TriageComplete: 'triage-complete',
  SpecialistOpinion: 'specialist-opinion',
  RecommendationDrafted: 'recommendation-drafted',
  DocumentAuthored: 'document-authored',
  Approved: 'approved',
  Completed: 'completed',
  Closed: 'closed',
  Rejected: 'rejected'
};
