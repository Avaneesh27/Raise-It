export type IssueStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface IssueReport {
  _id: string;
  reportId: string;
  imageUrl: string;
  categoryName: string;
  aiConfidence: number;
  isCategoryOverridden: boolean;
  description?: string;
  address?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  priorityScore: number;
  priorityLevel: PriorityLevel;
  isRecurring: boolean;
  nearbyReportCount: number;
  assignedDepartmentId?: {
    _id: string;
    name: string;
    code: string;
  };
  status: IssueStatus;
  resolutionNotes?: string;
  resolutionImageUrl?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface IssueUpdate {
  _id: string;
  reportId: string;
  status: IssueStatus;
  comment?: string;
  updateImageUrl?: string;
  createdAt: string;
}

export interface RAGSource {
  documentName: string;
  department?: string;
  pageOrSection?: string;
  relevanceScore?: number;
}
