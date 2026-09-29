const User = require('../models/User.model');
const tokenService = require('../services/token.service');
const HttpError = require('../utils/http-error');

const authMiddleware = async (ctx, next) => {
  const match = /^Bearer\s+(.+)$/i.exec(ctx.get('Authorization'));
  if (!match) {
    throw new HttpError(401, 'Authentication required', { code: 'UNAUTHENTICATED' });
  }
  if (match[1].length > 4096) {
    throw new HttpError(401, 'Invalid or expired token', { code: 'INVALID_TOKEN' });
  }

  let decoded;
  try {
    decoded = tokenService.verifyToken(match[1].trim());
  } catch {
    throw new HttpError(401, 'Invalid or expired token', { code: 'INVALID_TOKEN' });
  }

  const user = await User.findById(decoded.userId)
    .select('_id idRole role email user username lastName state isActive')
    .exec();

  if (!user || user.state !== 1 || user.isActive === false) {
    throw new HttpError(401, 'Invalid or expired token', { code: 'INVALID_TOKEN' });
  }

  ctx.state.account = user;
  ctx.state.user = {
    userId: user._id.toString(),
    email: user.email,
  };

  await next();
};

module.exports = authMiddleware;
