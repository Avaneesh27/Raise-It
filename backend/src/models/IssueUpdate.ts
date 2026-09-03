import { Schema, model, Document, Types } from 'mongoose';
import { IssueStatus } from '../config/constants';

export interface IIssueUpdate extends Document {
  reportId: Types.ObjectId;
  authorityId: Types.ObjectId;
  status: IssueStatus;
  comment?: string;
  updateImageUrl?: string;
  createdAt: Date;
}

const issueUpdateSchema = new Schema<IIssueUpdate>(
  {
    reportId: { type: Schema.Types.ObjectId, ref: 'IssueReport', required: true, index: true },
    authorityId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: Object.values(IssueStatus),
      required: true
    },
    comment: { type: String, trim: true },
    updateImageUrl: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const IssueUpdate = model<IIssueUpdate>('IssueUpdate', issueUpdateSchema);
