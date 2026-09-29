const Joi = require('joi');
const validate = require('./validate');

const idSchema = Joi.object({
  id: Joi.string().trim().min(1).max(100).required(),
});

const bodySchema = Joi.object({
  id: Joi.string().trim().min(1).max(100).required(),
  name: Joi.string().trim().min(1).max(150).required(),
  description: Joi.string().trim().max(1000).allow('').optional(),
});

module.exports = () => ({
  validateRegister: validate(bodySchema),
  validateUpdate: validate(bodySchema),
  validateGetById: validate(idSchema, 'params'),
});
