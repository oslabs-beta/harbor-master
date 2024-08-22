import express, { Request, Response, NextFunction } from 'express';
import metricsController from '../controllers/MetricsController';

const router = express.Router();

router.get('/memoryUsage/:startTime/:endTime', metricsController.getMemoryUsage, (req: Request, res: Response, next: NextFunction) => {
});

router.get('/cpuUsagePercentage/:startTime/:endTime', metricsController.getCpuUsagePercentage, (req: Request, res: Response, next: NextFunction) => {
});

router.get('/totalMemory/:startTime/:endTime', metricsController.getTotalMemory, (req: Request, res: Response, next: NextFunction) => {
});

router.get('/cores/:startTime/:endTime', metricsController.getCores, (req: Request, res: Response, next: NextFunction) => {
});

export default router;

