const Joi = require("joi");

const validateRegister = async (ctx, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().optional()
    });

  try {
    await schema.validateAsync(ctx.request.body);
    await next();
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error };
  }
};

const validateUpdate = async (ctx, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().optional()
    });
  try {
    await schema.validateAsync(ctx.request.body);
    await next();
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error };
  }
};



const validateGetById = async (ctx, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    });
  try {
    await schema.validateAsync(ctx.request.body);
    await next();
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error };
  }
};
module.exports = {
    validateRegister,
    validateUpdate,
    validateGetById,
};
