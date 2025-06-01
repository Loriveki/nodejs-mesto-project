import { celebrate, Joi, Segments } from 'celebrate';

const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().allow(''),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export default validateSignup;
