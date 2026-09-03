import { Router } from 'express';
import {
  getAuthorityDashboard,
  getAssignedIssues,
  getIssueDetails,
  updateIssueStatus,
  addProgressUpdate,
  resolveIssue,
  getPriorityLocations,
  getDepartmentAnalytics
} from '../controllers/authorityController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../config/constants';
import { upload } from '../utils/fileUpload';

const router = Router();

// Only AUTHORITY or ADMIN roles can access
router.use(authenticate, authorize(UserRole.AUTHORITY, UserRole.ADMIN));

router.get('/dashboard', getAuthorityDashboard);
router.get('/issues', getAssignedIssues);
router.get('/issues/:reportId', getIssueDetails);
router.patch('/issues/:reportId/status', updateIssueStatus);
router.post('/issues/:reportId/update', upload.single('image'), addProgressUpdate);
router.post('/issues/:reportId/resolve', upload.single('image'), resolveIssue);
router.get('/priority-locations', getPriorityLocations);
router.get('/analytics', getDepartmentAnalytics);

export default router;
