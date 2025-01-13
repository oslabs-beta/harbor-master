import express, { Request, Response, NextFunction } from 'express';
import { useInRouterContext } from 'react-router-dom';
const {getUsername,verifyUser,getRepositories,checkUser,createUser,getUser} = require('../controllers/userController');

const router = express.Router();

router.get('/get-username', getUsername, verifyUser , (req, res) => {
  res.json(res.locals.user);
});

router.get('/get-repos', getRepositories, (req, res) => {
  res.json(res.locals.repos);
});

router.get('/get-user',getUsername,getUser);

export default router;