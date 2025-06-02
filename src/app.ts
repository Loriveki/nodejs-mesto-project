import express, { Request, Response, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { isCelebrateError } from 'celebrate';
import userRouter from './routes/users';
import cardsRouter from './routes/cards';
import errorHandler from './middlewares/errorHandler';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import {
  requestLogger,
  errorLogger,
  systemLogger,
  systemErrorLogger,
} from './middlewares/logger';
import validateLogin from './middlewares/validateLogin';
import validateSignup from './middlewares/validateSignup';
import appConfig from './config';
import { STATUS_CODES } from './utils/constants';

const app = express();

// Настройка Mongoose
mongoose.set('strictQuery', true);

app.use(express.json());

// Логирование запросов
app.use(requestLogger);

// Открытые роуты
app.post('/signin', validateLogin, login);

app.post('/signup', validateSignup, createUser);

// Защищённые роуты
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardsRouter);

// Маршрут для корня
app.get('/', (req: Request, res: Response) => {
  res.status(STATUS_CODES.OK).send('Hello, Mesto API!');
});

// Логирование ошибок
app.use(errorLogger);

// Кастомный обработчик ошибок celebrate
const celebrateErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  if (isCelebrateError(err)) {
    const errorDetails = err.details.get('params') || err.details.get('body');
    if (errorDetails) {
      let message = 'Ошибка валидации данных';
      if (errorDetails.message.includes('userId') || errorDetails.message.includes('cardId')) {
        message = 'Неверный формат ID';
      } else if (errorDetails.message.includes('name')) {
        message = 'Имя должно быть от 2 до 30 символов';
      } else if (errorDetails.message.includes('about')) {
        message = 'О себе должно быть от 2 до 200 символов';
      } else if (errorDetails.message.includes('avatar') || errorDetails.message.includes('link')) {
        message = 'Некорректный URL';
      } else if (errorDetails.message.includes('email')) {
        message = 'Некорректный формат email';
      } else if (errorDetails.message.includes('password')) {
        message = 'Пароль обязателен';
      }
      res.status(STATUS_CODES.BAD_REQUEST).send({ message });
      return;
    }
  }
  next(err);
};
app.use(celebrateErrorHandler);

// Обработчик ошибок
app.use(errorHandler);

// Подключение к MongoDB
mongoose.connect(appConfig.mongoUri)
  .then(() => systemLogger(`Connected to MongoDB at ${appConfig.mongoUri}`))
  .catch((err) => systemErrorLogger('MongoDB connection error', err));

// Запуск сервера
app.listen(appConfig.port, () => {
  systemLogger(`Server is running on http://localhost:${appConfig.port}`);
});
