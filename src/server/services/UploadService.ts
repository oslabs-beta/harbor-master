import fs from 'fs';
import path from 'path';
import multer from 'multer';
import ServiceAccountCredentials from 'interfaces/ServiceAccountCredentials';

class UploadService {
  constructor() { }

  generateUploadMiddleware() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        // Ensure the file is saved with a .json extension
        const filename = file.fieldname + '-' + Date.now() + '.json';
        cb(null, filename);
      }
    });
    const upload = multer({ storage:storage });
    return upload.any();
  }

  parseFileContents(filePath: string) {
    const baseDirname = path.resolve(__dirname, '../../../');
    const absoluteFilePath = path.resolve(baseDirname, filePath);
    const fileContents = fs.readFileSync(absoluteFilePath, 'utf-8');
    console.log('DELETING FILE');
    fs.unlinkSync(absoluteFilePath);
    const credentials: ServiceAccountCredentials = JSON.parse(fileContents);

    return credentials;
  }
}

export default UploadService;