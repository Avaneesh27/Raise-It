import { Schema, model, Document, Types } from 'mongoose';

export interface ICivicDocument extends Document {
  name: string;
  departmentId?: Types.ObjectId;
  documentType: string; // SOP, Policy, Charter, Guidelines
  version: string;
  fileUrl: string;
  fileName: string;
  status: 'UPLOADED' | 'PROCESSING' | 'INDEXED' | 'FAILED';
  chunkCount?: number;
  uploadedBy: Types.ObjectId;
  indexedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const civicDocumentSchema = new Schema<ICivicDocument>(
  {
    name: { type: String, required: true, trim: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
    documentType: { type: String, default: 'Guidelines' },
    version: { type: String, default: '1.0' },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    status: {
      type: String,
      enum: ['UPLOADED', 'PROCESSING', 'INDEXED', 'FAILED'],
      default: 'UPLOADED'
    },
    chunkCount: { type: Number, default: 0 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    indexedAt: { type: Date }
  },
  { timestamps: true }
);

export const CivicDocument = model<ICivicDocument>('CivicDocument', civicDocumentSchema);
