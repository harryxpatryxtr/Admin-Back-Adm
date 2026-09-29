const tokenService = require('../services/token.service');

const authMiddleware = async (ctx, next) => {
  const token = ctx.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    ctx.throw(401, 'No token provided');
  }

  try {
    ctx.state.user = tokenService.verifyToken(token);
  } catch {
    ctx.throw(401, 'Invalid token');
  }
  // Fuera del try: los errores de la ruta no deben convertirse en "Invalid token"
  await next();
};

module.exports = authMiddleware;
