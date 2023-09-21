import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import Mongo from './util/mongo';
import v1AuthRouter from './lib/controllers/authController';
import v1LetterRouter from './lib/controllers/letterController';
import { NotFoundError } from './lib/middelwares/error/error';
import { errorHandler } from './lib/middelwares/error/errorHandler';

dotenv.config();

const app = express();

const mongo = Mongo.getInstance();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.all('/*', (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});
app.set('port', process.env.PORT || 8000);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  await mongo.connect();
})();

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json('Server working');
});

app.use('/v1', v1AuthRouter);
app.use('/v1', v1LetterRouter);

// 404 page not found
app.use((req: Request, res: Response) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
