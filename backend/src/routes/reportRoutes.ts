import { Router } from 'express';
import {
  createReport,
  getMyReports,
  getReportById,
  getReportTimeline,
  getNearbyReports,
  getCitizenDashboard
} from '../controllers/reportController';
import { authenticate } from '../middleware/auth';
import { upload } from '../utils/fileUpload';

const router = Router();

// Public / Citizen routes
router.post('/', authenticate, upload.single('image'), createReport);
router.get('/my', authenticate, getMyReports);
router.get('/nearby', authenticate, getNearbyReports);
router.get('/dashboard', authenticate, getCitizenDashboard);
router.get('/:reportId', authenticate, getReportById);
router.get('/:reportId/timeline', authenticate, getReportTimeline);

export default router;
