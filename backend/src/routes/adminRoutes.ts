import { Router } from 'express';
import {
  getAdminDashboard,
  getAuthorities,
  updateAuthorityStatus,
  getDepartments,
  createDepartment,
  updateDepartment,
  getCategories,
  createCategory,
  updateCategory,
  getAllIssues,
  getCivicDocuments,
  uploadCivicDocument,
  triggerDocumentIndex
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../config/constants';
import { upload } from '../utils/fileUpload';

const router = Router();

// Only ADMIN role can access
router.use(authenticate, authorize(UserRole.ADMIN));

router.get('/dashboard', getAdminDashboard);
router.get('/authorities', getAuthorities);
router.patch('/authorities/:id', updateAuthorityStatus);

router.get('/departments', getDepartments);
router.post('/departments', createDepartment);
router.patch('/departments/:id', updateDepartment);

router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);

router.get('/issues', getAllIssues);

router.get('/documents', getCivicDocuments);
router.post('/documents', upload.single('file'), uploadCivicDocument);
router.post('/documents/:id/index', triggerDocumentIndex);

export default router;
