import https from 'https';
import fetch, { RequestInit } from 'node-fetch';
import { GoogleAuth } from 'google-auth-library';

export async function getToken(fileName: string): Promise<string> {
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

    return accessToken;
  } catch (err) {
    console.error('Error obtaining access token:', err);
    throw err;
  }
}
