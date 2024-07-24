import crypto from 'crypto';
import config from '../config/envConfig';
import ServiceAccountCredentials from 'interfaces/ServiceAccountCredentials';

class EncryptionService {
  key: string;
  encryptionIV: string;
  encryptionMethod: string;

  constructor() {
    this.encryptionMethod = config.encryptionMethod!;
    this.key = crypto
      .createHash('sha512')
      .update(config.secretKey!)
      .digest('hex')
      .substring(0, 32);
    this.encryptionIV = crypto.
      createHash('sha512')
      .update(config.secretIV!)
      .digest('hex')
      .substring(0, 16);
  }

  encrypt(data: string) {
    const cipher = crypto.createCipheriv(this.encryptionMethod, this.key, this.encryptionIV);
    return Buffer.from(
      cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64');
  }

  decrypt(data: string) {
    const buffer = Buffer.from(data, 'base64');
    const decipher = crypto.createDecipheriv(this.encryptionMethod, this.key, this.encryptionIV);
    return (
      decipher.update(buffer.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    );
  }

  setEncryptedCredentials(credentials: ServiceAccountCredentials, name: string) {
    const encryptedCredentials: ServiceAccountCredentials = {
      name: name,
      type: this.encrypt(credentials.type),
      project_id: this.encrypt(credentials.project_id),
      private_key_id: this.encrypt(credentials.private_key_id),
      private_key: this.encrypt(credentials.private_key),
      client_email: this.encrypt(credentials.client_email),
      client_id: this.encrypt(credentials.client_id),
      auth_uri: this.encrypt(credentials.auth_uri),
      token_uri: this.encrypt(credentials.token_uri),
      auth_provider_x509_cert_url: this.encrypt(credentials.auth_provider_x509_cert_url),
      client_x509_cert_url: this.encrypt(credentials.client_x509_cert_url)
    };
    return encryptedCredentials;
  }

  setDecryptedCredentials(credentials: ServiceAccountCredentials) {
    const decryptedCredentials: ServiceAccountCredentials = {
      name: credentials.name,
      type: this.decrypt(credentials.type),
      project_id: this.decrypt(credentials.project_id),
      private_key_id: this.decrypt(credentials.private_key_id),
      private_key: this.decrypt(credentials.private_key),
      client_email: this.decrypt(credentials.client_email),
      client_id: this.decrypt(credentials.client_id),
      auth_uri: this.decrypt(credentials.auth_uri),
      token_uri: this.decrypt(credentials.token_uri),
      auth_provider_x509_cert_url: this.decrypt(credentials.auth_provider_x509_cert_url),
      client_x509_cert_url: this.decrypt(credentials.client_x509_cert_url)
    };
    return decryptedCredentials;
  }
}

export default EncryptionService;