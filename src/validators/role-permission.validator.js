const Joi = require('joi');
const mongoose = require('mongoose');
const validate = require('./validate');

const objectId = Joi.string().custom((value, helpers) => (
  mongoose.isValidObjectId(value) ? value : helpers.error('any.invalid')
));

module.exports = {
  validateSetPermission: validate(Joi.object({
    roleId: objectId.required(),
    permissionId: objectId.required(),
  })),
  validateRoleId: validate(Joi.object({ roleId: objectId.required() }), 'params'),
  validateAssignmentId: validate(
    Joi.object({ id: Joi.string().trim().min(1).max(100).required() }),
    'params',
  ),
};
