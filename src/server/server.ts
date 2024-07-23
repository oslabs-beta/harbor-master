import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import * as bodyParser from 'body-parser';
import clusters from './routes/clusters';
import loggerMiddleware from './middlewares/logger';

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(loggerMiddleware);

app.use(express.static(path.join(__dirname, '../../public')));
app.use('/api/clusters', clusters);

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

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
