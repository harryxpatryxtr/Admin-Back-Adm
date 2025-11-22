const Joi = require('joi');
const validateRegister = async (ctx, next) => {
const schema = Joi.object({
username: Joi.string().min(3).max(30).required(),
email: Joi.string().email().required(),
password: Joi.string().min(6).required(),
firstName: Joi.string().max(50).optional(),
lastName: Joi.string().max(50).optional()
});
try {
await schema.validateAsync(ctx.request.body);
await next();
} catch (error) {
ctx.status = 400;
ctx.body = { error: error.details[0].message };
}
};
const validateLogin = async (ctx, next) => {
const schema = Joi.object({
email: Joi.string().email().required(),
password: Joi.string().required()
});
try {
await schema.validateAsync(ctx.request.body);
await next();
} catch (error) {
ctx.status = 400;
ctx.body = { error: error.details[0].message };
}
};
const validateUpdateProfile = async (ctx, next) => {
const schema = Joi.object({
username: Joi.string().min(3).max(30).optional(),
firstName: Joi.string().max(50).optional(),
lastName: Joi.string().max(50).optional(),
avatar: Joi.string().uri().optional()
});
try {
await schema.validateAsync(ctx.request.body);
await next();
} catch (error) {
ctx.status = 400;
ctx.body = { error: error.details[0].message };
}
};
module.exports = {
validateRegister,
validateLogin,
validateUpdateProfile
};