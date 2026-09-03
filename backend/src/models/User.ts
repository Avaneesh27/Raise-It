import { Schema, model, Document, Types } from 'mongoose';
import { UserRole, UserStatus } from '../config/constants';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  departmentId?: Types.ObjectId;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CITIZEN,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
      required: true
    },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
    profileImage: { type: String }
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
