const Joi = require('joi');
const mongoose = require('mongoose');
const validate = require('./validate');
const { registerSchema, passwordSchema, assignRoleSchema } = require('./auth.validator');

const objectId = Joi.string().custom((value, helpers) => (
  mongoose.isValidObjectId(value) ? value : helpers.error('any.invalid')
));

// Datos de ficha que se pueden fijar al crear o editar
const profileFields = {
  firstName: Joi.string().trim().max(50).allow('').optional(),
  paternalSurname: Joi.string().trim().max(50).allow('').optional(),
  maternalSurname: Joi.string().trim().max(50).allow('').optional(),
  cellphone: Joi.string().trim().max(30).allow('').optional(),
  documentNumber: Joi.string().trim().max(20).allow('').optional(),
  sex: Joi.string().valid('Male', 'Female', 'Other').allow(null).optional(),
  idTypeUser: objectId.allow(null).optional(),
  idTypeDocument: objectId.allow(null).optional(),
  idTypeCargo: objectId.allow(null).optional(),
};

const createSchema = registerSchema.keys(profileFields);

const updateSchema = Joi.object({
  id: Joi.string().trim().min(1).max(100).required(),
  user: Joi.string().trim().min(3).max(30).optional(),
  email: Joi.string().trim().lowercase().email().max(254).optional(),
  password: passwordSchema.optional(),
  state: Joi.number().valid(0, 1).optional(),
  ...profileFields,
}).min(2);

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(25),
});

module.exports = {
  validateRegister: validate(createSchema),
  validateUpdate: validate(updateSchema),
  validateGetById: validate(Joi.object({ id: Joi.string().trim().max(100).required() }), 'params'),
  validateList: validate(querySchema, 'query'),
  validateAssignRole: validate(assignRoleSchema),
};
