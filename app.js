const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
async function listNodePools() {
  const keyFilename = './terraform-solo-test-cc74ef60ebc0.json';
  try {
    // Load the service account credentials
    const auth = new GoogleAuth({
      keyFile: keyFilename,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    // Obtain an access token for the service account
    const client = await auth.getClient();
    const accessToken = (await client.getAccessToken()).token;
    console.log()
    console.log('this is token->', accessToken);
  } catch (err) {
    console.error('Error listing node pools:', err);
  }
}
listNodePools();