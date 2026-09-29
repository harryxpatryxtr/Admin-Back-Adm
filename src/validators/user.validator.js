const Joi = require('joi');
const validate = require('./validate');
const { validateRegister: validateAuthRegister } = require('./auth.validator');

const updateSchema = Joi.object({
  id: Joi.string().trim().min(1).max(100).required(),
  user: Joi.string().trim().min(3).max(30).optional(),
  email: Joi.string().trim().lowercase().email().max(254).optional(),
  firstName: Joi.string().trim().max(50).allow('').optional(),
  paternalSurname: Joi.string().trim().max(50).allow('').optional(),
  maternalSurname: Joi.string().trim().max(50).allow('').optional(),
  cellphone: Joi.string().trim().max(30).allow('').optional(),
}).min(2);

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(25),
});

module.exports = {
  validateRegister: validateAuthRegister,
  validateUpdate: validate(updateSchema),
  validateGetById: validate(Joi.object({ id: Joi.string().trim().max(100).required() }), 'params'),
  validateList: validate(querySchema, 'query'),
  validateAssignRole: require('./auth.validator').validateAssignRole,
};
