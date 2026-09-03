import { IssueReport, IIssueReport } from '../models/IssueReport';
import { priorityConfig } from '../config/priorityConfig';

export interface RecurrenceAnalysisResult {
  isRecurring: boolean;
  nearbyReportCount: number;
  nearbyReports: Array<{
    reportId: string;
    categoryName: string;
    distanceMeters?: number;
    createdAt: Date;
    status: string;
  }>;
  hasRecentReportsWithin7Days: boolean;
}

export const findNearbySimilarReports = async (params: {
  longitude: number;
  latitude: number;
  categoryName: string;
  radiusMeters?: number;
  timeWindowDays?: number;
  excludeReportId?: string;
}): Promise<RecurrenceAnalysisResult> => {
  const {
    longitude,
    latitude,
    categoryName,
    radiusMeters = priorityConfig.defaultRadiusMeters,
    timeWindowDays = priorityConfig.timeWindowDays,
    excludeReportId
  } = params;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - timeWindowDays);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const query: any = {
    categoryName: categoryName.toLowerCase(),
    createdAt: { $gte: cutoffDate },
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: radiusMeters
      }
    }
  };

  if (excludeReportId) {
    query.reportId = { $ne: excludeReportId };
  }

  let nearbyDocs: any[] = [];
  try {
    nearbyDocs = await IssueReport.find(query)
      .limit(20)
      .select('reportId categoryName location createdAt status')
      .lean();
  } catch (err: any) {
    // Graceful fallback if database or 2dsphere index query encounters an issue
    console.warn(`[RecurrenceService] Geospatial search note: ${err.message}`);
    // If geo index isn't ready or simulated, attempt basic category count fallback
    nearbyDocs = await IssueReport.find({
      categoryName: categoryName.toLowerCase(),
      createdAt: { $gte: cutoffDate }
    })
      .limit(10)
      .select('reportId categoryName location createdAt status')
      .lean();
  }

  const nearbyReportCount = nearbyDocs.length;
  // An issue is recurring if 2 or more reports exist nearby in the window
  const isRecurring = nearbyReportCount >= 2;

  const hasRecentReportsWithin7Days = nearbyDocs.some(
    (doc) => new Date(doc.createdAt) >= sevenDaysAgo
  );

  return {
    isRecurring,
    nearbyReportCount,
    nearbyReports: nearbyDocs.map((doc) => ({
      reportId: doc.reportId,
      categoryName: doc.categoryName,
      createdAt: doc.createdAt,
      status: doc.status
    })),
    hasRecentReportsWithin7Days
  };
};
