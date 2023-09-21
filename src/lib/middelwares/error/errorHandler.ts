import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'class-validator';
import { BadRequestError, InternalServerError, NotFoundError } from './error';
import WinstonLogger from '../../../util/logger';
import errorCode from '../../../types/ErrorTypes/errorCode';

const logger = WinstonLogger.getInstance();

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // validationError를 위한 코드
  if (Array.isArray(err) && err[0] instanceof ValidationError) {
    const constraint = err[0].constraints;

    if (constraint) {
      if (constraint.hasOwnProperty('minLength')) {
        res.status(400).send({
          message: 'message too short!',
          code: errorCode.LETTER_TOO_SHORT,
          errors: 'message too short!',
        });
      } else if (constraint.hasOwnProperty('maxLength')) {
        res.status(400).send({
          message: 'message too long!',
          code: errorCode.LETTER_TOO_LONG,
          errors: 'message too long!',
        });
      }
    } else {
      res.status(500).send({ message: 'UNCATCHED_SERVER_ERROR' });
    }
  } else if (err instanceof BadRequestError) {
    res
      .status(err.code)
      .send({ message: err.message, code: err.errorCode, errors: err.data });
  } else if (err instanceof InternalServerError) {
    res
      .status(err.code)
      .send({ message: err.message, code: err.errorCode, errors: err.data });
  } else if (err instanceof NotFoundError) {
    res.status(err.code).send({ message: 'NOT_FOUND' });
  } else {
    logger.error(err.stack);
    res.status(500).send({ message: 'UNCATCHED_SERVER_ERROR' });
  }
};

export { errorHandler };
