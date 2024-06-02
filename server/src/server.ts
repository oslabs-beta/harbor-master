// const express = require('express');
import express, { Express, Request, Response } from 'express';
const port = 8080;
const app: Express = express();

app.get('/api/', (req: Request, res: Response) => {
  res.json({ AppName: 'Master-Harbor' });
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
