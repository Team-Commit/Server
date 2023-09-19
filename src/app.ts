import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import Mongo from './util/mongo';
dotenv.config();

const app = express();

const mongo = Mongo.getInstance();

app.use(
	cors({
		origin: true,
		credentials: true,
	})
);
app.all('/*', (req: Request, res: Response, next: NextFunction) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});
app.set('port', process.env.PORT || 8080);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
	await mongo.connect();
})();

app.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.json('Server working');
});

app.get('/test', (req: Request, res: Response, next: NextFunction) => {
	res.json({ data: 'ok' });
});

export { app };
