const { randomUUID } = require('node:crypto');

const errorMiddleware = async (ctx, next) => {
  const requestId = randomUUID();
  ctx.state.requestId = requestId;
  ctx.set('X-Request-Id', requestId);

  try {
    await next();
  } catch (err) {
    let status = err.status || 500;
    let publicMessage = err.message;

    if (err.name === 'ValidationError' || err.name === 'CastError') {
      status = 400;
      publicMessage = 'Invalid request data';
    } else if (err.code === 11000) {
      status = 409;
      publicMessage = 'A record with these values already exists';
    } else if (status >= 500) {
      publicMessage = 'Internal server error';
      console.error({
        event: 'request_error',
        requestId,
        method: ctx.method,
        path: ctx.path,
        name: err.name,
        message: err.message,
      });
    }

    ctx.status = status;
    const publicCode = status >= 500
      ? 'INTERNAL_ERROR'
      : typeof err.code === 'string'
        ? err.code
        : undefined;
    ctx.body = {
      success: false,
      error: publicMessage || 'Request failed',
      code: publicCode,
      details: status < 500 && Array.isArray(err.details) ? err.details : undefined,
      requestId,
    };
  }
};

module.exports = errorMiddleware;
