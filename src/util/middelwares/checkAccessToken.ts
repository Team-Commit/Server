import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const checkAccessToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.header('Authorization');

    if (!header) {
      throw new Error('No token in header');
    }

    const [tokenType, accessToken] = header.split(' ');

    if (tokenType !== 'Bearer') {
      throw new Error('Invalid token type');
    }

    const decoded = jwt.verify(accessToken, 'any');

    if (typeof decoded === 'string' || !decoded.userUUID) {
      throw new Error('Invalid access token');
    }

    req.userUUID = decoded.userUUID;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Expired token');
    } else if (err.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else if (err.name === 'NotBeforeError') {
      throw new Error('Invalid token');
    }

    throw err;
  }
};

export default checkAccessToken;
