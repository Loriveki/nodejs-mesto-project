import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import validateObjectId from '../middlewares/validateObjectId';
import {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', validateObjectId('userId'), getUserById);

router.patch(
  '/me',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
    }),
  }),
  updateProfile,
);

router.patch(
  '/me/avatar',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      avatar: Joi.string().required(),
    }),
  }),
  updateAvatar,
);

export default router;
