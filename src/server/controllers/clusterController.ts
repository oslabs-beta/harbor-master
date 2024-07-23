import { Request, Response, NextFunction } from 'express';
// const fetch = require('node-fetch'); // CommonJS import
import https from 'https';
import fetch, { RequestInit } from 'node-fetch';
import { GoogleAuth } from 'google-auth-library';
import GcsNode from 'interfaces/Node';
import GcsPod from 'interfaces/Pod';
import cluster from 'cluster';

const keyFilename = './k8-sa.json';
const endpointIP = '34.71.141.14';
const token =
  'ya29.c.c0ASRK0GYLuCLzlFdKN7Lvfx6rLquyveL6rkQATlMySL6NvKQfokE1JgaoLtcBl7ww4exU5ysQsslAi23nvzM_9WU1LOcsSGB2BCxPcRHF1kLRqFYHjwtgv3mit7SShV1Pr6NF4PSZ0wLrLcD5kC8htSsI7mH6tcldeTPQuvxY6taiVGp1SToqW9NLsHlrGWpef7FoRx4KN6LwOByluIBCZq5vJ9fX-aCmZmepxmNaH7kvCgGa5Zzq2hBeIbMns8E9nOhBeYXi-u4m0-aWTViJq9O0yOgCQq1smcqWUL4uZfFYZIvNzTbxUQRRbxBQjCOz2XQifashXTKGZm9dboxnIs-NK4c34Y_nO5moeXe1k4Vmve4IFD-vtinLPAH387PdSSUYRdm0dbahlceBQIMy6qSsiW4BoqMF05230BJlhrxx3ZgVUbbebS_M762aSm1qi7Ymj-xs9Wb0IF-OvmronoOf__iY_u1oXoZzin9SUv4v2Bb2mzO4xcnayaeZnX6ams_y4a3tvXRRvYM9sIydXR9ixcIR6miwQf8wiF4YBg9QJhMk1y59-zofVuR0vW7_vkUbaY25SJ-aB71Rir-BbUciuwlwV1qIoBQq4urqzUf2vOj4Mz-xMcfe5qj7jrxUqIpq9v6ic5xslv2SsY3Ru6xaRBX0QhQ_WqkyzyOF2lJZgvMgslmFJiWr0xz1ZBm5-2QiMY_IMWb2W4enBJOgiv1c6nF59zjVz2zXXnMZ6xmZOR7_a86h-SymXoOMJY2dXBJ6dlnFW3nMfYe6mzekgBlyV8hMqXncUeu3Xbsm7IRtlrwt4d7u7wSrVVq3SZf04UBSUWVIhwdX2kJiUuqmW54k_nX_zgUmI6_Q0xQyxWxBZVJsJ-1Ig6_F63RgiJQ76xpfkffS5jI0rSQymVoW3WIbJazXuOSJqYfS3ucWxmB2Bko3xsmQxeBWqRmlcc4ytld0fc3eJoU84RiIkjBnuIaJYZVzmodR_Ym5gUisurRgjaXs8B6QpF-';
class ClusterController {
  public async getNodeList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const url = `https://${endpointIP}/api/v1/nodes`;
    try {
      // Fetch the access token
      //  const accessToken = await this.getToken(keyFilename);
      const accessToken = token;
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

  public async getPodList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const url = `https://${endpointIP}/api/v1/pods`;
    try {
      // Fetch the access token
      //  const accessToken = await this.getToken(keyFilename);
      const accessToken = token;
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
          status: item.status.phase,
        }));
      res.json(pods);
    } catch (error) {}
  }

  public getToken = async (
    fileName: string
  ): Promise<string | null | undefined> => {
    try {
      // Log the key file name (for debugging)
      console.log('Generating token using this file -> ', fileName);

      // Load the service account credentials
      const auth = new GoogleAuth({
        keyFile: fileName,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });

      // Obtain an access token for the service account
      const client = await auth.getClient();
      const tokenResponse = await client.getAccessToken();
      const accessToken = tokenResponse.token;

      // Log the access token (for debugging)
      console.log('Access Token:', accessToken);
      return accessToken;
    } catch (err) {
      // Log and rethrow the error
      console.error('Error obtaining access token:', err);
      throw err; // Rethrow the error to be handled by the caller
    }
  };
}

export default new ClusterController();
