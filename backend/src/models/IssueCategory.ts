import { Schema, model, Document, Types } from 'mongoose';

export interface IIssueCategory extends Document {
  name: string;
  key: string;
  description?: string;
  departmentId: Types.ObjectId;
  basePriorityWeight: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const issueCategorySchema = new Schema<IIssueCategory>(
  {
    name: { type: String, required: true, trim: true },
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    basePriorityWeight: { type: Number, required: true, default: 20 },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }
  },
  { timestamps: true }
);

export const IssueCategory = model<IIssueCategory>('IssueCategory', issueCategorySchema);
