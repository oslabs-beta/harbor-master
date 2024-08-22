import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import config from './config/envConfig';
import projectController from './controllers/ProjectController';
import userController from './controllers/UserController';
import errorController from './controllers/ErrorController';
import uploadService from './services/UploadService';
import { ProjectModel, UserModel } from './config/mongoConfig';

import * as bodyParser from 'body-parser';
import clusters from './routes/clusterRouter';
import loggerMiddleware from './middlewares/logger';
import cors from 'cors';

require('dotenv').config();

const fetch = require('node-fetch');
const app = express();
app.use(
  cors({
    origin: `http://localhost:8080`,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(loggerMiddleware);

app.use(express.static(path.join(__dirname, '../../public')));
const ashraf_metrics = require('./routes/ashraf_routes');

app.use('/metrics', ashraf_metrics);
app.use('/api/clusters', clusters);

const uploadFileMiddleware = uploadService.generateUploadMiddleware();

app.get('/', (req, res, next) => {
  try {
    res.send('index.html');
  } catch (error) {
    return next({
      log: 'Error sending index.html to client',
      message: { err: 'Server error loading page' },
    });
  }
});

app.get('/api', (req, res) => {
  res.json({ AppName: 'Master-Harbor' });
});

// project controller
app.post('/create-project', uploadFileMiddleware, projectController.createProject, (req, res) => {
  res.json({ id: res.locals.id });
});
app.get('/get-project/:id', projectController.getProjectById, (req, res) => {
  res.json(res.locals.project)
})
app.post('/deploy/:id', projectController.getProjectById, projectController.deployProject, (req, res) => {
  res.sendStatus(200);
})

// auth controller
app.get('/login', userController.githubLogin);
app.get('/auth-callback', userController.callback);
app.get('/get-repos', userController.getRepositories, (req, res) => {
  res.json(res.locals.repos);
});
app.get('/get-user', userController.getUser, userController.verifyUser, userController.getRepositories, (req, res) => {
  res.json(res.locals.user);
});

// mock endpoint to check db, for development only
app.get('/read-db', async (req, res) => {
  const response = await UserModel.find();
  res.json(response);
});

// global error handling
app.use(errorController.handleError);

app.listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
});
