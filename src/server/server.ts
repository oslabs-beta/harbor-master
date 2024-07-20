import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import makeT from '../common/tsfuncs/test';
import { allowedNodeEnvironmentFlags } from 'process';
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules/@xterm/xterm')));
app.get('/', (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.send('index.html');
  } catch (error) {
    next(error);
  }
});

app.get('/api/', (req: Request, res: Response) => {
  res.json({ AppName: 'Master-Harbor' });
});

app.post('/test/', makeT, (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.bool) res.send('done');
  else res.sendStatus(500);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message.replace(/\x1b\[[0-9;]*m/g, '')});
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
