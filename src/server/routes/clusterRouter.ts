import express, { Request, Response } from 'express';
import clusterController from '../controllers/ClusterController';

const router = express.Router();

//TODO THIS ENDPOINT NOT NEEDED
router.get(
  '/clusters',
  clusterController.getClusterList,
  (req: Request, res: Response): void => {
    res.json({ RouteName: 'nodes-pods-maping-Route' });
  }
);

//TODO THIS ENDPOINT NOT NEEDED
router.get(
  '/nodes',
  clusterController.getNodeList,
  (req: Request, res: Response): void => {
    res.json({ RouteName: 'node-list-Route' });
  }
);

//TODO THIS ENDPOINT NOT NEEDED
router.get(
  '/pods',
   clusterController.getPodList,
  (req: Request, res: Response): void => {
    res.json({ RouteName: 'pod-list-Route' });
  }
);

router.get(
  '/details',
  clusterController.getClusterMapping,
  (req: Request, res: Response): void => {
    res.json({ RouteName: 'nodes-pods-maping-Route' });
  }
);

router.get('/', (req: Request, res: Response): void => {
  res.json({ RouteName: 'Nodes-Route' });
});

export default router;
