import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

// Load environment configuration
dotenv.config();

import { connectDatabase } from './config/database';
import authRoutes from './routes/authRoutes';
import reportRoutes from './routes/reportRoutes';
import aiRoutes from './routes/aiRoutes';
import authorityRoutes from './routes/authorityRoutes';
import adminRoutes from './routes/adminRoutes';
import ragRoutes from './routes/ragRoutes';
import notificationRoutes from './routes/notificationRoutes';
import { runSeed } from './seed/seed';
import { Department } from './models/Department';

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file hosting for uploaded evidence images & civic docs
const uploadDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadDir));

// System Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'RaiseIt Civic Backend API',
    timestamp: new Date().toISOString()
  });
});

// Mount Platform API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/authority', authorityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/notifications', notificationRoutes);

// Connect DB and launch server
connectDatabase().then(async () => {
  // Auto-seed database if empty
  const deptCount = await Department.countDocuments();
  if (deptCount === 0) {
    console.log('[Init] Database is empty, running initial seeder...');
    await runSeed();
  }

  app.listen(PORT, () => {
    console.log(`========================================================`);
    console.log(`🚀 RaiseIt Backend Server running on port ${PORT}`);
    console.log(`📍 Health Check: http://localhost:${PORT}/health`);
    console.log(`========================================================`);
  });
});

export default app;
