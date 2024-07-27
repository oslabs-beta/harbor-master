import GcsNode from './Node';

export default interface GcsCluster {
  endpoint: string;
  name: string;
  zone: string;
  location: string;
  nodeCount: number;
  nodes: GcsNode[];
}
