const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const validateRegister = async (ctx, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().max(50).allow("").optional(),
    lastName: Joi.string().max(50).allow("").optional(),
    role: objectId.required(),
  });

  try {
    await schema.validateAsync(ctx.request.body);
  } catch (error) {
    ctx.status = 400;
    ctx.body = { success: false, error: error.message };
    return;
  }
  await next();
};

const validateUpdate = async (ctx, next) => {
  const schema = Joi.object({
    id: objectId.required(),
    username: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    firstName: Joi.string().max(50).allow("").optional(),
    lastName: Joi.string().max(50).allow("").optional(),
    role: objectId.optional(),
    isActive: Joi.boolean().optional(),
  });
  try {
    await schema.validateAsync(ctx.request.body);
  } catch (error) {
    ctx.status = 400;
    ctx.body = { success: false, error: error.message };
    return;
  }
  await next();
};

const validateGetById = async (ctx, next) => {
  const schema = Joi.object({
    id: objectId.required(),
  });
  try {
    await schema.validateAsync(ctx.request.params);
  } catch (error) {
    ctx.status = 400;
    ctx.body = { success: false, error: error.message };
    return;
  }
  await next();
};

module.exports = {
  validateRegister,
  validateUpdate,
  validateGetById,
};
