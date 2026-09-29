const HttpError = require('../utils/http-error');

const validate = (schema, source = 'body') => async (ctx, next) => {
  let value;
  try {
    const input = source === 'body' ? ctx.request.body : ctx[source];
    value = await schema.validateAsync(input, { abortEarly: false });
  } catch (error) {
    if (!error.isJoi) {
      throw error;
    }
    throw new HttpError(400, 'Invalid request data', {
      code: 'VALIDATION_ERROR',
      details: error.details.map(({ path, message }) => ({ path, message })),
    });
  }

  if (source === 'body') {
    ctx.request.body = value;
  } else if (source === 'params') {
    ctx.params = value;
    ctx.request.params = value;
  } else if (source === 'query') {
    ctx.state.validatedQuery = value;
  }

  await next();
};

module.exports = validate;
