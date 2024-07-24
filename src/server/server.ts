import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import makeT from '../common/tsfuncs/test';
import config from './config/envConfig';
import { createProject, getProjectById, editProjectState } from './controllers/projectController';
import UploadService from './services/UploadService';
const app = express();
const uploadService = new UploadService();
const uploadFileMiddleware = uploadService.generateUploadMiddleware();
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules/@xterm/xterm')));
app.get('/', (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.send('index.html');
  } catch (error) {
    next(error);
  }
});

app.get('/api', (req: Request, res: Response) => {
  res.json({ AppName: 'Master-Harbor' });
});

app.post('/test/', makeT, (req: Request, res: Response) => {
  res.status(200).send('Done');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message.replace(/\x1b\[[0-9;]*m/g, '')});
});

app.post('/create-project', uploadFileMiddleware, createProject, (req, res) => {
  res.status(200).json( { id: res.locals.id })
});

app.get('/get-project/:id', getProjectById, (req, res) => {
  res.status(200).json(res.locals.project)
})

app.listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
});
