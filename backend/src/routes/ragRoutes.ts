import { Router } from 'express';
import { queryCivicAssistant } from '../controllers/ragController';
import { authenticate } from '../middleware/auth';

const router = Router();

// RAG Civic Assistant query endpoint (authenticated citizens, authorities, admins)
router.post('/query', authenticate, queryCivicAssistant);

export default router;
