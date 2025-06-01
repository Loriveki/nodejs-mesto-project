import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import validateObjectId from '../middlewares/validateObjectId';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);

router.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().required(),
    }),
  }),
  createCard,
);

router.delete('/:cardId', validateObjectId('cardId'), deleteCard);

router.put('/:cardId/likes', validateObjectId('cardId'), likeCard);

router.delete('/:cardId/likes', validateObjectId('cardId'), dislikeCard);

export default router;
