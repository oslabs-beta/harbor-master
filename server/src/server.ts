// const express = require('express');
import express, { Express, Request, Response } from 'express';
import authController from './controllers/authController';

const port = 8080;
const app: Express = express();

app.get('/api', (req: Request, res: Response) => {
  res.json({ AppName: 'Master-Harbor' });
});

app.get('/github-login', authController.githubLogin)

app.get('/auth-callback', authController.callback);

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
