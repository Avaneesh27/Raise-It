import { Types } from 'mongoose';
import { Notification } from '../models/Notification';

export class NotificationService {
  static async sendNotification(params: {
    userId: Types.ObjectId | string;
    reportId?: Types.ObjectId | string;
    title: string;
    message: string;
    type: 'SUBMISSION' | 'STATUS_CHANGE' | 'PROGRESS_UPDATE' | 'RESOLUTION' | 'SYSTEM';
  }): Promise<void> {
    try {
      await Notification.create({
        userId: params.userId,
        reportId: params.reportId,
        title: params.title,
        message: params.message,
        type: params.type,
        isRead: false
      });
    } catch (err: any) {
      console.error(`[NotificationService] Error creating notification: ${err.message}`);
    }
  }

  static async getUserNotifications(userId: string) {
    return Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('reportId', 'reportId categoryName status');
  }

  static async markAsRead(notificationId: string, userId: string) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
  }
}
