import express, { Request, Response } from 'express';
import ClusterController from '../controllers/clusterController';

const router = express.Router();

//TODO THIS ENDPOINT NOT NEEDED
router.get(
  '/clusters',
  ClusterController.getClusterList,
  (req: Request, res: Response): void => {
    res.json({ RouteName: 'nodes-pods-maping-Route' });
  }
);

//TODO THIS ENDPOINT NOT NEEDED
router.get(
  '/nodes',
  ClusterController.getNodeList,
  (req: Request, res: Response): void => {
    res.json({ RouteName: 'node-list-Route' });
  }
);

//TODO THIS ENDPOINT NOT NEEDED
router.get(
  '/pods',
  ClusterController.getPodList,
  (req: Request, res: Response): void => {
    res.json({ RouteName: 'pod-list-Route' });
  }
);

router.get(
  '/details',
  ClusterController.getClusterMapping,
  (req: Request, res: Response): void => {
    res.json({ RouteName: 'nodes-pods-maping-Route' });
  }
);

router.get('/', (req: Request, res: Response): void => {
  res.json({ RouteName: 'Nodes-Route' });
});

export default router;
