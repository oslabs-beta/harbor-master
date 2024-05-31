// const express = require('express');
import express, { Express, Request, Response } from 'express';
const port = 8080;
const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('This is express');
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
