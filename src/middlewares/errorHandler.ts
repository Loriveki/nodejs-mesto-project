import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../types/errors';
import { errorLogger } from './logger';
import { STATUS_CODES } from '../utils/constants';

const errorHandler = (
  err: CustomError & { code?: number; name?: string },
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  errorLogger(err, req, res, () => {});

  if (err.code === 11000) {
    res.status(STATUS_CODES.CONFLICT).send({ message: 'Пользователь с таким email уже существует' });
    return;
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(STATUS_CODES.UNAUTHORIZED).send({ message: 'Некорректный токен' });
    return;
  }

  const status = err.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message = status === STATUS_CODES.INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : err.message;

  res.status(status).send({ message });
};

export default errorHandler;
