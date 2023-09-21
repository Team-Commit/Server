import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import YAML from 'yamljs';
import Mongo from './util/mongo';
import v1AuthRouter from './lib/controllers/authController';
import v1UserRouter from './lib/controllers/userController';
import v1LetterRouter from './lib/controllers/letterController';
import { NotFoundError } from './lib/middelwares/error/error';
import { errorHandler } from './lib/middelwares/error/errorHandler';
import WinstonLogger from './util/logger';

dotenv.config();

const app = express();

const mongo = Mongo.getInstance();

const logger = WinstonLogger.getInstance();

const swaggerSpec = YAML.load(path.join(__dirname, '/util/swaggerDocs.yaml'));

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
  if (process.env.NODE_ENV !== 'test') {
    await mongo.connect();
  }
})();

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`[${req.method}] ${req.url} ${duration}ms`);
  });
  next();
});

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json('Server working');
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true }),
);

app.use('/v1', v1AuthRouter);
app.use('/v1', v1UserRouter);
app.use('/v1', v1LetterRouter);

// 404 page not found
app.use((req: Request, res: Response) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
