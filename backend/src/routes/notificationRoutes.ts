import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { NotificationService } from '../services/notificationService';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await NotificationService.getUserNotifications(req.user!._id.toString());
    res.json({ notifications });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/read', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const updated = await NotificationService.markAsRead(req.params.id, req.user!._id.toString());
    res.json({ notification: updated });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
