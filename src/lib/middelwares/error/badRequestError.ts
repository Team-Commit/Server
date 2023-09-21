import HttpError from './httpError';

export default class BadRequestError extends HttpError {
  constructor(errorCode: number, data: { [key: string]: string }) {
    super('BAD_REQUEST', 400);
    this.errorCode = errorCode;
    this.data = data;
  }
}
