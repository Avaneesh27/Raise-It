import { Response } from 'express';
import { AuthRequest, validateAuthorityDepartment } from '../middleware/auth';
import { IssueReport } from '../models/IssueReport';
import { IssueUpdate } from '../models/IssueUpdate';
import { NotificationService } from '../services/notificationService';
import { IssueStatus, ALLOWED_STATUS_TRANSITIONS, UserRole } from '../config/constants';
import { updateStatusSchema, resolveReportSchema } from '../validators';
import { getPublicImageUrl } from '../utils/fileUpload';

export const getAuthorityDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const deptFilter: any = {};
    if (req.user.role === UserRole.AUTHORITY) {
      if (!req.user.departmentId) {
        res.status(400).json({ message: 'Authority user has no assigned department' });
        return;
      }
      deptFilter.assignedDepartmentId = req.user.departmentId;
    }

    const total = await IssueReport.countDocuments(deptFilter);
    const submitted = await IssueReport.countDocuments({ ...deptFilter, status: IssueStatus.SUBMITTED });
    const underReview = await IssueReport.countDocuments({ ...deptFilter, status: IssueStatus.UNDER_REVIEW });
    const inProgress = await IssueReport.countDocuments({
      ...deptFilter,
      status: { $in: [IssueStatus.ASSIGNED, IssueStatus.IN_PROGRESS] }
    });
    const resolved = await IssueReport.countDocuments({ ...deptFilter, status: IssueStatus.RESOLVED });
    const highPriority = await IssueReport.countDocuments({ ...deptFilter, priorityLevel: 'HIGH' });

    // Recent 5 issues
    const recentIssues = await IssueReport.find(deptFilter)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('citizenId', 'name email');

    // High priority recurring clusters
    const priorityClusters = await IssueReport.find({
      ...deptFilter,
      isRecurring: true,
      status: { $ne: IssueStatus.RESOLVED }
    })
      .sort({ nearbyReportCount: -1, createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        total,
        submitted,
        underReview,
        inProgress,
        resolved,
        highPriority
      },
      recentIssues,
      priorityClusters
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAssignedIssues = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const query: any = {};

    // Strict Department Scoping (PRD Section 6.2)
    if (req.user.role === UserRole.AUTHORITY) {
      if (!req.user.departmentId) {
        res.status(400).json({ message: 'Authority is not assigned to any department' });
        return;
      }
      query.assignedDepartmentId = req.user.departmentId;
    }

    const { status, priority, category, isRecurring, search, sort = 'priority' } = req.query;

    if (status) query.status = status;
    if (priority) query.priorityLevel = priority;
    if (category) query.categoryName = (category as string).toLowerCase();
    if (isRecurring !== undefined) query.isRecurring = isRecurring === 'true';

    if (search) {
      query.$or = [
        { reportId: new RegExp(search as string, 'i') },
        { address: new RegExp(search as string, 'i') },
        { description: new RegExp(search as string, 'i') }
      ];
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'priority') {
      sortOption = { priorityScore: -1, createdAt: -1 };
    } else if (sort === 'date_asc') {
      sortOption = { createdAt: 1 };
    }

    const issues = await IssueReport.find(query)
      .sort(sortOption)
      .populate('citizenId', 'name email phone')
      .populate('assignedDepartmentId', 'name code');

    res.json({ issues, count: issues.length });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getIssueDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reportId } = req.params;
    const report = await IssueReport.findOne({
      $or: [{ reportId }, { _id: reportId.match(/^[0-9a-fA-F]{24}$/) ? reportId : null }]
    })
      .populate('citizenId', 'name email phone')
      .populate('assignedDepartmentId', 'name code contactEmail')
      .populate('assignedAuthorityId', 'name email');

    if (!report) {
      res.status(404).json({ message: 'Report not found' });
      return;
    }

    // Department boundary check (Scenario 7)
    if (req.user && !validateAuthorityDepartment(report.assignedDepartmentId._id.toString(), req.user)) {
      res.status(403).json({
        message: 'Forbidden: You do not have permission to view complaints outside your assigned department'
      });
      return;
    }

    const timeline = await IssueUpdate.find({ reportId: report._id })
      .sort({ createdAt: 1 })
      .populate('authorityId', 'name role');

    // Nearby similar reports
    const nearby = await IssueReport.find({
      categoryName: report.categoryName,
      _id: { $ne: report._id },
      location: {
        $nearSphere: {
          $geometry: report.location,
          $maxDistance: 500
        }
      }
    })
      .limit(5)
      .select('reportId categoryName status priorityLevel createdAt')
      .lean();

    res.json({ report, timeline, nearbyReports: nearby });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateIssueStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { reportId } = req.params;
    const validated = updateStatusSchema.parse(req.body);

    const report = await IssueReport.findOne({
      $or: [{ reportId }, { _id: reportId.match(/^[0-9a-fA-F]{24}$/) ? reportId : null }]
    });

    if (!report) {
      res.status(404).json({ message: 'Report not found' });
      return;
    }

    // Department boundary check (Scenario 7)
    if (!validateAuthorityDepartment(report.assignedDepartmentId.toString(), req.user)) {
      res.status(403).json({
        message: 'Forbidden: You do not have permission to manage issues outside your department'
      });
      return;
    }

    // State machine check (PRD Section 46 & 78)
    const allowedNext = ALLOWED_STATUS_TRANSITIONS[report.status] || [];
    if (!allowedNext.includes(validated.status)) {
      res.status(400).json({
        message: `Invalid status transition from ${report.status} to ${validated.status}. Allowed transitions: [${allowedNext.join(', ')}]`
      });
      return;
    }

    const oldStatus = report.status;
    report.status = validated.status;
    if (validated.status === IssueStatus.ASSIGNED && !report.assignedAuthorityId) {
      report.assignedAuthorityId = req.user._id;
    }
    await report.save();

    // Log update event
    await IssueUpdate.create({
      reportId: report._id,
      authorityId: req.user._id,
      status: validated.status,
      comment: validated.comment || `Status progressed from ${oldStatus} to ${validated.status}`,
      updateImageUrl: validated.updateImageUrl
    });

    // Notify citizen
    await NotificationService.sendNotification({
      userId: report.citizenId,
      reportId: report._id,
      title: 'Report Status Updated',
      message: `Your report #${report.reportId} status has been updated to ${validated.status}.`,
      type: 'STATUS_CHANGE'
    });

    res.json({ message: 'Report status updated successfully', report });
  } catch (err: any) {
    res.status(400).json({ message: err.errors?.[0]?.message || err.message });
  }
};

export const addProgressUpdate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { reportId } = req.params;
    const { comment } = req.body;

    if (!comment || comment.trim().length === 0) {
      res.status(400).json({ message: 'Progress comment is required' });
      return;
    }

    const report = await IssueReport.findOne({
      $or: [{ reportId }, { _id: reportId.match(/^[0-9a-fA-F]{24}$/) ? reportId : null }]
    });

    if (!report) {
      res.status(404).json({ message: 'Report not found' });
      return;
    }

    if (!validateAuthorityDepartment(report.assignedDepartmentId.toString(), req.user)) {
      res.status(403).json({ message: 'Forbidden: Issue belongs to another department' });
      return;
    }

    let updateImageUrl: string | undefined;
    if (req.file) {
      updateImageUrl = getPublicImageUrl(req, req.file.filename);
    }

    const update = await IssueUpdate.create({
      reportId: report._id,
      authorityId: req.user._id,
      status: report.status,
      comment,
      updateImageUrl
    });

    // Notify citizen
    await NotificationService.sendNotification({
      userId: report.citizenId,
      reportId: report._id,
      title: 'Progress Update on Your Report',
      message: `An authority added an update to #${report.reportId}: "${comment.substring(0, 80)}..."`,
      type: 'PROGRESS_UPDATE'
    });

    res.status(201).json({ message: 'Progress update added', update });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const resolveIssue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { reportId } = req.params;
    const validated = resolveReportSchema.parse(req.body);

    const report = await IssueReport.findOne({
      $or: [{ reportId }, { _id: reportId.match(/^[0-9a-fA-F]{24}$/) ? reportId : null }]
    });

    if (!report) {
      res.status(404).json({ message: 'Report not found' });
      return;
    }

    if (!validateAuthorityDepartment(report.assignedDepartmentId.toString(), req.user)) {
      res.status(403).json({ message: 'Forbidden: Issue belongs to another department' });
      return;
    }

    let resolutionImageUrl = validated.resolutionImageUrl;
    if (req.file) {
      resolutionImageUrl = getPublicImageUrl(req, req.file.filename);
    }

    report.status = IssueStatus.RESOLVED;
    report.resolutionNotes = validated.resolutionNotes;
    report.resolutionImageUrl = resolutionImageUrl;
    report.resolvedAt = new Date();
    await report.save();

    await IssueUpdate.create({
      reportId: report._id,
      authorityId: req.user._id,
      status: IssueStatus.RESOLVED,
      comment: `Issue resolved: ${validated.resolutionNotes}`,
      updateImageUrl: resolutionImageUrl
    });

    await NotificationService.sendNotification({
      userId: report.citizenId,
      reportId: report._id,
      title: 'Issue Resolved! 🎉',
      message: `Great news! Your civic report #${report.reportId} has been successfully resolved.`,
      type: 'RESOLUTION'
    });

    res.json({ message: 'Issue marked as resolved', report });
  } catch (err: any) {
    res.status(400).json({ message: err.errors?.[0]?.message || err.message });
  }
};

/**
 * High Priority Locations & Clusters (PRD Section 49)
 */
export const getPriorityLocations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deptFilter: any = {};
    if (req.user?.role === UserRole.AUTHORITY && req.user.departmentId) {
      deptFilter.assignedDepartmentId = req.user.departmentId;
    }

    // High recurrence clusters
    const clusters = await IssueReport.find({
      ...deptFilter,
      isRecurring: true
    })
      .sort({ nearbyReportCount: -1, createdAt: -1 })
      .limit(30)
      .populate('assignedDepartmentId', 'name code');

    res.json({ clusters });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Authority Department Analytics (PRD Section 50)
 */
export const getDepartmentAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deptFilter: any = {};
    if (req.user?.role === UserRole.AUTHORITY && req.user.departmentId) {
      deptFilter.assignedDepartmentId = req.user.departmentId;
    }

    // Issues by category
    const byCategory = await IssueReport.aggregate([
      { $match: deptFilter },
      { $group: { _id: '$categoryName', count: { $sum: 1 } } }
    ]);

    // Issues by status
    const byStatus = await IssueReport.aggregate([
      { $match: deptFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Issues by priority
    const byPriority = await IssueReport.aggregate([
      { $match: deptFilter },
      { $group: { _id: '$priorityLevel', count: { $sum: 1 } } }
    ]);

    res.json({
      byCategory: byCategory.map((c) => ({ category: c._id, count: c.count })),
      byStatus: byStatus.map((s) => ({ status: s._id, count: s.count })),
      byPriority: byPriority.map((p) => ({ priority: p._id, count: p.count }))
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
