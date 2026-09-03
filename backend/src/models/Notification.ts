import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  userId: Types.ObjectId;
  reportId?: Types.ObjectId;
  title: string;
  message: string;
  type: 'SUBMISSION' | 'STATUS_CHANGE' | 'PROGRESS_UPDATE' | 'RESOLUTION' | 'SYSTEM';
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reportId: { type: Schema.Types.ObjectId, ref: 'IssueReport' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['SUBMISSION', 'STATUS_CHANGE', 'PROGRESS_UPDATE', 'RESOLUTION', 'SYSTEM'],
      default: 'SYSTEM'
    },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notification = model<INotification>('Notification', notificationSchema);
