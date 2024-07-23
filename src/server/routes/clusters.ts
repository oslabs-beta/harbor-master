import express, { Request, Response } from 'express';
import ClusterController from '../controllers/clusterController';

const router = express.Router();

router.get(
  '/nodes',
  ClusterController.getNodeList,
  (req: Request, res: Response): void => {
    res.json({ RouteName: 'node-list-Route' });
  }
);

router.get(
  '/pods',
  ClusterController.getPodList,
  (req: Request, res: Response): void => {
    res.json({ RouteName: 'pod-list-Route' });
  }
);

router.get('/', (req: Request, res: Response): void => {
  res.json({ RouteName: 'Nodes-Route' });
});

export default router;
