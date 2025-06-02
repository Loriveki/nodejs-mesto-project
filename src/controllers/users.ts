import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import User from '../models/user';
import { RequestWithUser } from '../types/RequestWithUser';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors';
import { CustomError, ValidationError } from '../types/errors';
import appConfig from '../config';
import { STATUS_CODES } from '../utils/constants';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find({}).select('-__v');
    res.status(STATUS_CODES.OK).send(users);
  } catch (error) {
    next(error as CustomError);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-__v');
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(STATUS_CODES.OK).send(user);
  } catch (error) {
    next(error as CustomError);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      name, about, avatar, email, password: hash,
    });
    await user.save();
    const savedUser = await User.findById(user._id).select('-__v -password');
    res.status(STATUS_CODES.CREATED).send(savedUser);
  } catch (error) {
    if ((error as ValidationError).name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные для создания пользователя'));
    }
    next(error as CustomError);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as RequestWithUser).user._id;
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    ).select('-__v');
    if (!updatedUser) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(STATUS_CODES.OK).send(updatedUser);
  } catch (error) {
    if ((error as ValidationError).name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные для обновления профиля'));
    }
    next(error as CustomError);
  }
};

export const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as RequestWithUser).user._id;
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    ).select('-__v');
    if (!updatedUser) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(STATUS_CODES.OK).send(updatedUser);
  } catch (error) {
    if ((error as ValidationError).name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные для обновления аватара'));
    }
    next(error as CustomError);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Неверные почта или пароль');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedError('Неверные почта или пароль');
    }

    const token = jwt.sign(
      { _id: (user._id as Types.ObjectId).toString() },
      appConfig.jwtSecret,
      { expiresIn: '7d' },
    );

    res.cookie('jwt', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
    });

    res.status(STATUS_CODES.OK).send({ message: 'Успешный вход' });
  } catch (error) {
    next(error as CustomError);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as RequestWithUser).user._id;
    const user = await User.findById(userId).select('-__v');
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(STATUS_CODES.OK).send(user);
  } catch (error) {
    next(error as CustomError);
  }
};
