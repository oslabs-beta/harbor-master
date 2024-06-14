// const express = require('express');
import express, { Express, Request, Response } from 'express';
const port = 8080;
const app: Express = express();

require('dotenv').config();

const { UserModel, ProjectModel, VertexModel, EdgeModel } = require('./db/mongoConfig');

// for testing mongo
app.get('/', async (req, res) => {
  const newUser = await UserModel.create({
    userId: 'test123',
    googleCloudId: 'testG123',
    createdAt: 'now',
    googleRegion: 'your-mom',
    vertices: [{ resourceType: 'cluster', position: [1, 1], data: {} }, { resourceType: 'pod', position: [2, 2], data: {} }],
    edges: [{ endpointVertexIds: ['abc', 'def'] }]
  });
  res.json(newUser);
})

app.get('/api/', (req: Request, res: Response) => {
  res.json({ AppName: 'Master-Harbor' });
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
