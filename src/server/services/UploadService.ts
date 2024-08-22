import fs from 'fs';
import path from 'path';
import multer from 'multer';
import ServiceAccountCredentials from 'interfaces/ServiceAccountCredentials';

class UploadService {
  constructor() { }

  generateUploadMiddleware() {
    const upload = multer({ dest: 'uploads/' });
    return upload.any();
  }

  parseFileContents(filePath: string) {
    const baseDirname = path.resolve(__dirname, '../../../');
    const absoluteFilePath = path.resolve(baseDirname, filePath);
    const fileContents = fs.readFileSync(absoluteFilePath, 'utf-8');
    fs.unlinkSync(absoluteFilePath);
    const credentials: ServiceAccountCredentials = JSON.parse(fileContents);

    return credentials;
  }
}

export default new UploadService();