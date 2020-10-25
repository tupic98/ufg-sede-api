import 'reflect-metadata';
import 'dotenv/config';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import { connectDB } from './database';
import { pagination } from 'typeorm-pagination';
import indexRouter from './routes/index';
import apiRouter from './routes/api';

const port: Number = Number(process.env.PORT) || 3000;
const startServer = async () => {
  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(pagination);

  app.use('/', indexRouter);
  app.use('/api', apiRouter);
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

(async () => {
  await connectDB();
  await startServer();
})();
