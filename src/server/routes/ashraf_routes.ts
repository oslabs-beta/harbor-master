//  routes file
import express, { Request, Response, NextFunction } from 'express';

const ashraf_metrics_controller = require('../controllers/ashraf_metrics');


const router = express.Router();

router.get('/memoryUsage/:startTime/:endTime', ashraf_metrics_controller.getMemoryUsage, (req: Request, res: Response, next: NextFunction) => {
});

router.get('/cpuUsagePercentage/:startTime/:endTime', ashraf_metrics_controller.getCpuUsagePercentage, (req: Request, res: Response, next: NextFunction) => {
});

router.get('/totalMemory/:startTime/:endTime', ashraf_metrics_controller.getTotalMemory, (req: Request, res: Response, next: NextFunction) => {
});

router.get('/cores/:startTime/:endTime', ashraf_metrics_controller.getCores, (req: Request, res: Response, next: NextFunction) => {
});

module.exports = router;

