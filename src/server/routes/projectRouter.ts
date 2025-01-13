import express, { Request, Response, NextFunction } from 'express';
import UploadService from '../services/UploadService';
const {createProject,getProjectById,deployProject,checkProject,getEndpoint,deleteProject,getProjMetrics,getToken,generateKeyFile} = require('../controllers/projectController');
const {getUsername} = require('../controllers/userController');
const uploadService = new UploadService();
const uploadFileMiddleware = uploadService.generateUploadMiddleware();

const router = express.Router();

router.post('/create-project', uploadFileMiddleware, checkProject, createProject, (req, res) => {
  res.json({ id: res.locals.id,exists:false });
});

router.get('/get-project/:id', getProjectById, (req, res) => {
  res.json(res.locals.project)
})

router.post('/deploy/:id', getProjectById, getUsername, deployProject, (req, res) => {
  res.sendStatus(200);
});

router.get('/getEndpoint/:id',generateKeyFile,getEndpoint);

router.get('/delete-project/:id',getProjectById,getUsername,deleteProject,(req,res)=>{
  console.log('IN PROJECTROUTER SENDING 200')
  return res.sendStatus(200);
})

router.get('/get-metrics/:id/:startTime/:endTime',generateKeyFile,getToken,getProjMetrics,(req,res)=>{
  res.status(200).send(res.locals.metrics);
})

export default router;