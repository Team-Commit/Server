import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import WinstonLogger from './logger';

const logger = WinstonLogger.getInstance();

dotenv.config();

class Mongo {
  private static instance: Mongo;

  private readonly mongoUri: string;

  private readonly connectOption: ConnectOptions;

  constructor() {
    // 개발환경 DB와 배포환경 DB구분
    if (process.env.NODE_ENV === 'local') {
      this.mongoUri = `${process.env.DEV_DATABASE_URL}`;

      this.connectOption = {
        user: process.env.DEV_DATABASE_USER,
        pass: process.env.DEV_DATABASE_PASSWORD,
        dbName: process.env.DEV_DATABASE_NAME,
        heartbeatFrequencyMS: 2000,
      };
    } else {
      this.mongoUri = `${process.env.PROD_DATABASE_URL}`;

      this.connectOption = {
        user: process.env.PROD_DATABASE_USER,
        pass: process.env.PROD_DATABASE_PASSWORD,
        dbName: process.env.PROD_DATABASE_NAME,
        heartbeatFrequencyMS: 2000,
      };
    }
  }

  static getInstance(): Mongo {
    if (!Mongo.instance) {
      Mongo.instance = new Mongo();
    }

    return Mongo.instance;
  }

  async connect(): Promise<void> {
    await mongoose.connect(this.mongoUri, this.connectOption);
    logger.info('DB Connected');
  }
}

export default Mongo;
