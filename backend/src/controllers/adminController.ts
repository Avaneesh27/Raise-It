import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Department } from '../models/Department';
import { IssueCategory } from '../models/IssueCategory';
import { IssueReport } from '../models/IssueReport';
import { CivicDocument } from '../models/CivicDocument';
import { UserRole, UserStatus, IssueStatus } from '../config/constants';
import { AIProxyService } from '../services/aiProxyService';
import { getPublicImageUrl } from '../utils/fileUpload';

export const getAdminDashboard = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalCitizens = await User.countDocuments({ role: UserRole.CITIZEN });
    const totalAuthorities = await User.countDocuments({ role: UserRole.AUTHORITY });
    const pendingAuthorities = await User.countDocuments({
      role: UserRole.AUTHORITY,
      status: UserStatus.PENDING
    });

    const totalIssues = await IssueReport.countDocuments();
    const activeIssues = await IssueReport.countDocuments({
      status: { $in: [IssueStatus.SUBMITTED, IssueStatus.UNDER_REVIEW, IssueStatus.ASSIGNED, IssueStatus.IN_PROGRESS] }
    });
    const resolvedIssues = await IssueReport.countDocuments({ status: IssueStatus.RESOLVED });
    const highPriorityIssues = await IssueReport.countDocuments({ priorityLevel: 'HIGH' });

    const recentIssues = await IssueReport.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('citizenId', 'name email')
      .populate('assignedDepartmentId', 'name code');

    res.json({
      stats: {
        totalCitizens,
        totalAuthorities,
        pendingAuthorities,
        totalIssues,
        activeIssues,
        resolvedIssues,
        highPriorityIssues
      },
      recentIssues
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAuthorities = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const authorities = await User.find({ role: UserRole.AUTHORITY })
      .select('-passwordHash')
      .populate('departmentId', 'name code')
      .sort({ createdAt: -1 });

    res.json({ authorities });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAuthorityStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, departmentId } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (departmentId) updateData.departmentId = departmentId;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true })
      .select('-passwordHash')
      .populate('departmentId', 'name code');

    if (!user) {
      res.status(404).json({ message: 'Authority not found' });
      return;
    }

    res.json({ message: 'Authority updated successfully', authority: user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getDepartments = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json({ departments });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, code, description, contactEmail, contactPhone } = req.body;
    const department = await Department.create({
      name,
      code: code.toUpperCase(),
      description,
      contactEmail,
      contactPhone
    });
    res.status(201).json({ message: 'Department created', department });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndUpdate(id, req.body, { new: true });
    if (!department) {
      res.status(404).json({ message: 'Department not found' });
      return;
    }
    res.json({ message: 'Department updated', department });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getCategories = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await IssueCategory.find()
      .populate('departmentId', 'name code')
      .sort({ name: 1 });
    res.json({ categories });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, key, description, departmentId, basePriorityWeight } = req.body;
    const category = await IssueCategory.create({
      name,
      key: key.toLowerCase(),
      description,
      departmentId,
      basePriorityWeight: basePriorityWeight || 20
    });
    res.status(201).json({ message: 'Category created', category });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await IssueCategory.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json({ message: 'Category updated', category });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllIssues = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { departmentId, status, priority, category, isRecurring } = req.query;
    const query: any = {};

    if (departmentId) query.assignedDepartmentId = departmentId;
    if (status) query.status = status;
    if (priority) query.priorityLevel = priority;
    if (category) query.categoryName = (category as string).toLowerCase();
    if (isRecurring !== undefined) query.isRecurring = isRecurring === 'true';

    const issues = await IssueReport.find(query)
      .sort({ createdAt: -1 })
      .populate('citizenId', 'name email phone')
      .populate('assignedDepartmentId', 'name code');

    res.json({ issues, count: issues.length });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getCivicDocuments = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const documents = await CivicDocument.find()
      .populate('departmentId', 'name code')
      .sort({ createdAt: -1 });
    res.json({ documents });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadCivicDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Document file is required' });
      return;
    }

    const { name, departmentId, documentType = 'Guidelines', version = '1.0' } = req.body;
    const fileUrl = getPublicImageUrl(req, req.file.filename);

    const doc = await CivicDocument.create({
      name: name || req.file.originalname,
      departmentId: departmentId || undefined,
      documentType,
      version,
      fileUrl,
      fileName: req.file.filename,
      uploadedBy: req.user!._id,
      status: 'PROCESSING'
    });

    // Asynchronously trigger AI service RAG indexation
    AIProxyService.indexDocument(req.file.path, {
      documentId: doc._id.toString(),
      name: doc.name,
      documentType: doc.documentType
    }).then(async (success) => {
      doc.status = success ? 'INDEXED' : 'FAILED';
      doc.indexedAt = new Date();
      await doc.save();
    });

    res.status(201).json({ message: 'Document uploaded and indexing started', document: doc });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const triggerDocumentIndex = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const doc = await CivicDocument.findById(id);
    if (!doc) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    doc.status = 'PROCESSING';
    await doc.save();

    // Trigger AI service
    const success = await AIProxyService.indexDocument(doc.fileUrl, {
      documentId: doc._id.toString(),
      name: doc.name,
      documentType: doc.documentType
    });

    doc.status = success ? 'INDEXED' : 'FAILED';
    doc.indexedAt = new Date();
    await doc.save();

    res.json({ message: 'Re-indexing completed', status: doc.status });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
