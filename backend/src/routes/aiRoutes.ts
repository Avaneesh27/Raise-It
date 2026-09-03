import { Router } from 'express';
import { classifyImage, analyzeReport } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';
import { upload } from '../utils/fileUpload';

const router = Router();

router.post('/classify-image', authenticate, upload.single('image'), classifyImage);
router.post('/analyze-report', authenticate, analyzeReport);

export default router;
