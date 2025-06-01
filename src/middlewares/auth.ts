import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { RequestWithUser } from '../types/RequestWithUser';
import { UnauthorizedError } from '../errors';

config();

const auth = (req: Request, res: Response, next: NextFunction) => {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  const token = cookieHeader.split('; ').find((row) => row.startsWith('jwt='))?.split('=')[1];

  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  if (!process.env.JWT_SECRET) {
    next(new UnauthorizedError('Внутренняя ошибка сервера'));
    return;
  }

  let payload: { _id: string };
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET) as { _id: string };
  } catch {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  (req as RequestWithUser).user = payload;
  next();
};

export default auth;
