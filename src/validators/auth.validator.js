const Joi = require('joi');
const mongoose = require('mongoose');
const validate = require('./validate');

const passwordInput = Joi.string()
  .max(72)
  .custom((value, helpers) => {
    if (Buffer.byteLength(value, 'utf8') > 72) {
      return helpers.error('password.bytes');
    }
    return value;
  })
  .messages({ 'password.bytes': 'Password must not exceed 72 bytes' });

const passwordSchema = passwordInput
  .min(12)
  .required();

const registerSchema = Joi.object({
  user: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().trim().lowercase().email().max(254).required(),
  password: passwordSchema,
  firstName: Joi.string().trim().max(50).allow('').optional(),
  paternalSurname: Joi.string().trim().max(50).allow('').optional(),
  maternalSurname: Joi.string().trim().max(50).allow('').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().max(254).required(),
  password: passwordInput.required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().max(4096).required(),
});

const userIdSchema = Joi.object({
  id: Joi.string().trim().min(1).max(100).required(),
});

const assignRoleSchema = Joi.object({
  id: Joi.string().trim().min(1).max(100).required(),
  roleId: Joi.string().custom((value, helpers) => (
    mongoose.isValidObjectId(value) ? value : helpers.error('any.invalid')
  )).required(),
});

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateRefresh: validate(refreshSchema),
  validateUserId: validate(userIdSchema, 'params'),
  validateAssignRole: validate(assignRoleSchema),
  registerSchema,
  passwordSchema,
  assignRoleSchema,
};
