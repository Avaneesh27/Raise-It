import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AIProxyService } from '../services/aiProxyService';
import { IssueReport } from '../models/IssueReport';
import { ragQuerySchema } from '../validators';

export const queryCivicAssistant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = ragQuerySchema.parse(req.body);

    let context: any = {};
    if (validated.reportId) {
      const report = await IssueReport.findOne({
        $or: [{ reportId: validated.reportId }, { _id: validated.reportId.match(/^[0-9a-fA-F]{24}$/) ? validated.reportId : null }]
      }).populate('assignedDepartmentId', 'name code');

      if (report) {
        context = {
          reportId: report.reportId,
          category: report.categoryName,
          status: report.status,
          department: (report.assignedDepartmentId as any)?.name || 'General Municipal',
          address: report.address
        };
      }
    }

    const ragResult = await AIProxyService.queryRAG({
      question: validated.question,
      use_rag: validated.use_rag,
      context
    });

    res.json({
      answer: ragResult.answer,
      sources: ragResult.sources,
      isFallback: ragResult.isFallback || false,
      latencyMs: ragResult.latencyMs,
      telemetry: ragResult.telemetry
    });
  } catch (err: any) {
    res.status(400).json({ message: err.errors?.[0]?.message || err.message });
  }
};
