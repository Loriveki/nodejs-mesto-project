import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../types/errors';
import { errorLogger } from './logger';

const errorHandler = (
  err: CustomError & { code?: number; name?: string },
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  errorLogger(err, req, res, () => {});

  if (err.code === 11000) {
    res.status(409).send({ message: 'Пользователь с таким email уже существует' });
    return;
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).send({ message: 'Некорректный токен' });
    return;
  }

  const status = err.status || 500;
  const message = status === 500 ? 'На сервере произошла ошибка' : err.message;

  res.status(status).send({ message });
};

export default errorHandler;
