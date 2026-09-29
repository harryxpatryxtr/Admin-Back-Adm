const Joi = require("joi");

const validateRegister = async (ctx, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().optional()
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
    id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().optional()
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
    id: Joi.string().required(),
    });
  try {
    await schema.validateAsync(ctx.request.params );
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
