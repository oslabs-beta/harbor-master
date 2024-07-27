import { Request, Response, NextFunction } from 'express';
// const fetch = require('node-fetch'); // CommonJS import
import https from 'https';
import fetch, { RequestInit } from 'node-fetch';
import { GoogleAuth } from 'google-auth-library';
import GcsNode from 'interfaces/Node';
import GcsPod from 'interfaces/Pod';
import cluster from 'interfaces/Cluster';
import { getToken } from '../services/gkeService';
import GcsCluster from 'interfaces/Cluster';

// const keyFilename = '../keys/k8-test-428619-f078a86334f9.json';
// const endpointIP = '34.71.141.14';

const keyFilename = '../keys/harbor-master-430602-f4f5fa8200ff.json';
const projectName = 'harbor-master-430602';
const endpointIP = '34.173.62.141';

const token = '';
class ClusterController {
  //TODO THIS MIDDLEWARE NO LONGER NEEDED
  public async getClusterList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const url = `https://container.googleapis.com/v1/projects/${projectName}/locations/-/clusters`;
    try {
      // Fetch the access token
      const accessToken = await getToken(keyFilename);
      const agent = new https.Agent({
        rejectUnauthorized: false, // This will ignore the certificate verification
      });
      // Log the access token (for debugging)
      console.log('Access Token:', accessToken);

      // Make the API request
      const apiResponse = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        agent,
      } as RequestInit);

      // Check if the response is ok (status code 200-299)
      if (!apiResponse.ok) {
        throw new Error(
          `Network response was not ok: ${apiResponse.statusText}`
        );
      }

      // Parse the response as JSON
      const data = await apiResponse.json();
      console.log('Data received:', data);

      const clusters: GcsCluster[] = data.clusters.map((cluster: any) => ({
        name: cluster.name,
        zone: cluster.zone,
        endpoint: cluster.endpoint,
        location: cluster.location,
        nodeCount: cluster.currentNodeCount,
      }));

      clusters.forEach((cluster: any) => {
        console.log(cluster.endpoint);
      });
      res.json(clusters);
    } catch (error) {
      // Pass errors to the error handling middleware
      next(error);
    }
  }

  //TODO THIS MIDDLEWARE NO LONGER NEEDED
  public async getNodeList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const url = `https://${endpointIP}/api/v1/nodes`;
    try {
      // Fetch the access token
      // const accessToken = await this.getToken(keyFilename);
      const accessToken = await getToken(keyFilename);
      const agent = new https.Agent({
        rejectUnauthorized: false, // This will ignore the certificate verification
      });
      // Log the access token (for debugging)
      console.log('Access Token:', accessToken);

      // Make the API request
      const apiResponse = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        agent,
      } as RequestInit);

      // Check if the response is ok (status code 200-299)
      if (!apiResponse.ok) {
        throw new Error(
          `Network response was not ok: ${apiResponse.statusText}`
        );
      }

      // Parse the response as JSON
      const data = await apiResponse.json();
      console.log('Data received:', data.items);

      const nodes: GcsNode[] = data.items.map((item: any) => ({
        name: item.metadata.name,
        // zone: item.metadata.labels.topology['gke.io/zone'],
        // region: item.metadata.labels.topology['kubernetes.io/region'],
        cpuCapacity: item.status.capacity.cpu,
        storageCapacity: item.status.capacity['ephemeral-storage'],
        memoryCapacity: item.status.capacity.memory,
        cpuAllocated: item.status.allocatable.cpu,
        storageAllocated: item.status.allocatable['ephemeral-storage'],
        memoryAllocated: item.status.allocatable.memory,
      }));
      console.log('this is the nodes ->', nodes);
      // Send the data to the client
      res.json(nodes);
    } catch (error) {
      // Pass errors to the error handling middleware
      next(error);
    }
  }
  //TODO THIS MIDDLEWARE NO LONGER NEEDED
  public async getPodList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const url = `https://${endpointIP}/api/v1/pods`;
    try {
      // Fetch the access token
      // const accessToken = await this.getToken(keyFilename);
      const accessToken = await getToken(keyFilename);
      const agent = new https.Agent({
        rejectUnauthorized: false, // This will ignore the certificate verification
      });
      // Log the access token (for debugging)
      console.log('Access Token:', accessToken);

      // Make the API request
      const apiResponse = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        agent,
      } as RequestInit);

      // Check if the response is ok (status code 200-299)
      if (!apiResponse.ok) {
        throw new Error(
          `Network response was not ok: ${apiResponse.statusText}`
        );
      }

      // Parse the response as JSON
      const data = await apiResponse.json();
      console.log('Data received:', data.items);

      const pods: GcsPod = data.items
        .filter((pod: any) => pod.metadata.labels.app)
        .map((item: any) => ({
          name: item.metadata.name,
          parent: item.metadata.labels.app,
          cluster: item.spec.containers.name,
          nodeName: item.spec.nodeName,
          status: item.status.phase,
        }));
      res.json(pods);
    } catch (error) {
      next(error);
    }
  }

  public async getClusterMapping(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // const nodesUrl = `https://${endpointIP}/api/v1/nodes`;
    // const podsUrl = `https://${endpointIP}/api/v1/pods`;
    const clusterUrl = `https://container.googleapis.com/v1/projects/${projectName}/locations/-/clusters`;

    try {
      // Fetch the access token
      const accessToken = await getToken(keyFilename);

      if (!accessToken) {
        throw new Error('Failed to obtain access token');
      }
      // const accessToken = token;
      const agent = new https.Agent({
        rejectUnauthorized: false, // This will ignore the certificate verification
      });

      const options: RequestInit = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        agent,
      };

      // Make the API request
      const clusterApiResponse = await fetch(clusterUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        agent,
      } as RequestInit);

      // Parse the response as JSON
      const data = await clusterApiResponse.json();
      console.log('Data received:', data);

      const clusters: GcsCluster[] = data.clusters.map((cluster: any) => ({
        name: cluster.name,
        zone: cluster.zone,
        endpoint: cluster.endpoint,
        location: cluster.location,
        nodeCount: cluster.currentNodeCount,
      }));

      const results: GcsCluster[] = await Promise.all(
        clusters.map(async (cluster) => {
          const nodesUrl = `https://${endpointIP}/api/v1/nodes`;
          const podsUrl = `https://${endpointIP}/api/v1/pods`;
          //TODO REPLACE WITH OPTIONS
          //Parallel api requests
          const [nodeApiResponse, podApiResponse] = await Promise.all([
            fetch(nodesUrl, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              agent,
            } as RequestInit),
            fetch(podsUrl, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              agent,
            } as RequestInit),
          ]);

          // Check the response
          if (!nodeApiResponse.ok) {
            throw new Error(
              `Network node response was not ok: ${nodeApiResponse.statusText}`
            );
          }
          if (!podApiResponse.ok) {
            throw new Error(
              `Network pod response was not ok: ${podApiResponse.statusText}`
            );
          }

          // Parse the response as JSON
          const nodeData = await nodeApiResponse.json();
          // console.log('Node Data received:', nodeData.items);

          const podData = await podApiResponse.json();
          // console.log('Pod Data received:', podData.items);

          const nodeMap: { [key: string]: GcsNode } = {};
          nodeData.items.forEach((item: any) => {
            const nodeName = item.metadata.name;
            if (nodeName) {
              nodeMap[nodeName] = {
                name: nodeName,
                zone: item.metadata.labels['topology.kubernetes.io/zone'],
                region: item.metadata.labels['topology.kubernetes.io/region'],
                cpuCapacity: item.status.capacity.cpu,
                storageCapacity: item.status.capacity['ephemeral-storage'],
                memoryCapacity: item.status.capacity.memory,
                cpuAllocated: item.status.allocatable.cpu,
                storageAllocated: item.status.allocatable['ephemeral-storage'],
                memoryAllocated: item.status.allocatable.memory,
                pods: [],
              };
            }
          });
          podData.items
            .filter(
              (pod: any) =>
                pod.metadata.labels.app &&
                pod.metadata.namespace !== 'kube-system' &&
                pod.metadata.namespace !== 'gke-gmp-system'
            )
            .forEach((pod: any) => {
              const nodeName = pod.spec.nodeName;
              if (nodeName && nodeMap[nodeName]) {
                nodeMap[nodeName].pods.push({
                  name: pod.metadata.name,
                  parent: pod.metadata.labels.app,
                  cluster: pod.spec.containers.name,
                  nodeName: pod.spec.nodeName,
                  status: pod.status.phase,
                });
              }
            });
          return {
            name: cluster.name,
            zone: cluster.zone,
            endpoint: cluster.endpoint,
            location: cluster.location,
            nodeCount: cluster.nodeCount,
            nodes: Object.values(nodeMap), // Convert nodeMap object to array
          };
        })
      );
      res.json(results);
    } catch (error) {
      //TODO add error handeling
      next(error);
    }
  }

  public async getToken(fileName: string): Promise<string> {
    try {
      const auth = new GoogleAuth({
        keyFile: fileName,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });

      const client = await auth.getClient();
      const tokenResponse = await client.getAccessToken();
      const accessToken = tokenResponse.token;

      if (!accessToken) {
        throw new Error('Failed to obtain access token');
      }

      console.log('Access Token:', accessToken);
      return accessToken;
    } catch (err) {
      console.error('Error obtaining access token:', err);
      throw err;
    }
  }
}

export default new ClusterController();
