import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

// Папка и файлы логов
const logsDir = path.join(__dirname, '..', 'logs');
const requestLogPath = path.join(logsDir, 'request.log');
const errorLogPath = path.join(logsDir, 'error.log');
const systemErrorLogPath = path.join(logsDir, 'system-error.log');
const systemLogPath = path.join(logsDir, 'system.log');

// Создаём папку logs, если её нет
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

function logToFile(filePath: string, data: unknown) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...(typeof data === 'object' && data !== null ? data : { message: String(data) }),
  };

  fs.appendFile(
    filePath,
    `${JSON.stringify(logEntry)}\n`,
    (err) => {
      if (err) {
        const errorLogEntry = {
          timestamp: new Date().toISOString(),
          message: `Ошибка при записи в лог: ${err.message}`,
          stack: err.stack,
        };
        fs.appendFileSync(systemErrorLogPath, `${JSON.stringify(errorLogEntry)}\n`);
      }
    },
  );
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logToFile(requestLogPath, {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
  });
  next();
};

export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logToFile(errorLogPath, {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: err.stack,
  });
  next(err);
};

export const systemLogger = (message: string) => {
  logToFile(systemLogPath, { message });
};

export const systemErrorLogger = (message: string, error: Error) => {
  logToFile(systemErrorLogPath, {
    message,
    stack: error.stack,
  });
};
