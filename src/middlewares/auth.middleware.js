const tokenService = require('../services/token.service');

const authMiddleware = async (ctx, next) => {
  try {
    const token = ctx.headers.authorization?.replace('Bearer ', '');
    console.log('Received token:', token);
    if (!token) {
      ctx.throw(401, 'No token provided');
    }

    const decoded = tokenService.verifyToken(token);
    console.log('Decoded token:', decoded);
    ctx.state.user = decoded;
    await next();
  } catch  {
    ctx.throw(401, 'Invalid token');
  }
};

module.exports = authMiddleware;