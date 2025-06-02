import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { RequestWithUser } from '../types/RequestWithUser';
import { BadRequestError, NotFoundError, ForbiddenError } from '../errors';
import { CustomError, ValidationError } from '../types/errors';
import { STATUS_CODES } from '../utils/constants';

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cards = await Card.find({})
      .populate('owner', 'name about avatar _id')
      .populate('likes', '_id');
    res.status(STATUS_CODES.OK).send(cards);
  } catch (err) {
    next(err as CustomError);
  }
};

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as RequestWithUser).user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: userId });
    const populatedCard = await Card.findById(card._id)
      .populate('owner', 'name about avatar _id')
      .populate('likes', '_id')
      .select('-__v');
    res.status(STATUS_CODES.CREATED).send(populatedCard);
  } catch (error) {
    if ((error as ValidationError).name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные для создания карточки'));
      return;
    }
    next(error as CustomError);
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).populate('owner');
    if (!card) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }

    const userId = (req as RequestWithUser).user._id;
    if (card.owner._id.toString() !== userId.toString()) {
      next(new ForbiddenError('Нет прав для удаления этой карточки'));
      return;
    }

    await card.deleteOne();
    res.status(STATUS_CODES.OK).send({ message: 'Карточка удалена' });
  } catch (error) {
    next(error as CustomError);
  }
};

export const likeCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as RequestWithUser).user._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    )
      .populate('owner', 'name about avatar _id')
      .populate('likes', '_id')
      .select('-__v');

    if (!card) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }

    res.status(STATUS_CODES.OK).send(card);
  } catch (err) {
    next(err as CustomError);
  }
};

export const dislikeCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as RequestWithUser).user._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    )
      .populate('owner', 'name about avatar _id')
      .populate('likes', '_id')
      .select('-__v');

    if (!card) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }

    res.status(STATUS_CODES.OK).send(card);
  } catch (err) {
    next(err as CustomError);
  }
};
