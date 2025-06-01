import { celebrate, Joi, Segments } from 'celebrate';

const validateObjectId = (idField: 'cardId' | 'userId') => celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    [idField]: Joi.string().length(24).hex().required(),
  }),
});

export default validateObjectId;
