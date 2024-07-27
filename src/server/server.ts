import express, { NextFunction } from 'express';
import path from 'path';
import makeT from '../common/tsfuncs/test';
import cookieParser from 'cookie-parser';
import config from './config/envConfig';
import { createProject, getProjectById, editProjectState } from './controllers/projectController';
import { githubLogin, callback, getRepositories, getUser, verifyUser } from './controllers/userController';
import { handleError } from './controllers/errorController';
import UploadService from './services/UploadService';
import { ProjectModel } from './config/mongoConfig';
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
const uploadService = new UploadService();
const uploadFileMiddleware = uploadService.generateUploadMiddleware();
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules/@xterm/xterm')));
app.get('/', (req, res, next) => {
  try {
    res.send('index.html');
  } catch (error) {
    return next({ log: 'Error sending index.html to client', message: { err: 'Server error loading page' } });
  }
});

app.get('/api', (req, res) => {
  res.json({ AppName: 'Master-Harbor' });
});

app.post('/test', makeT, (req, res) => {
  res.status(200).send('Done');
});

// project controller
app.post('/create-project', uploadFileMiddleware, createProject, (req, res) => {
  res.json({ id: res.locals.id })
});
app.get('/get-project/:id', getProjectById, (req, res) => {
  res.json(res.locals.project)
});
// auth controller
app.get('/login', githubLogin);
app.get('/auth-callback', callback);
app.get('/get-repos', getRepositories, (req, res) => {
  res.json(res.locals.repos)
});
app.get('/get-user', getUser, verifyUser, (req, res) => {
  res.json(res.locals.user);
})

// mock endpoint to check db
app.get('/read-db', async (req, res) => {
  const response = await ProjectModel.find();
  res.json(response);
})

// global error handling
app.use(handleError);

app.listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
});
