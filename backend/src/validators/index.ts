import { z } from 'zod';
import { UserRole, IssueStatus } from '../config/constants';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole).optional().default(UserRole.CITIZEN),
  departmentId: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const createReportSchema = z.object({
  categoryName: z.string().min(1, 'Category is required'),
  aiDetectedCategory: z.string().optional(),
  aiConfidence: z.coerce.number().min(0).max(1).default(0),
  isCategoryOverridden: z.coerce.boolean().default(false),
  description: z.string().optional(),
  longitude: z.coerce.number().min(-180).max(180),
  latitude: z.coerce.number().min(-90).max(90),
  address: z.string().optional(),
  ward: z.string().optional()
});

export const updateStatusSchema = z.object({
  status: z.nativeEnum(IssueStatus),
  comment: z.string().optional(),
  updateImageUrl: z.string().optional()
});

export const resolveReportSchema = z.object({
  resolutionNotes: z.string().min(5, 'Resolution notes are required'),
  resolutionImageUrl: z.string().optional()
});

export const ragQuerySchema = z.object({
  question: z.string().min(2, 'Question cannot be empty'),
  reportId: z.string().optional(),
  use_rag: z.boolean().optional()
});
