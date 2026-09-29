const HttpError = require('../utils/http-error');
const { getActiveRoles, getPermissionKeys } = require('../services/access.service');

const authorizePermission = (permissionKey) => async (ctx, next) => {
  const activeRoles = await getActiveRoles(ctx.state.account);

  if (activeRoles.length === 0) {
    throw new HttpError(403, 'Insufficient permissions', { code: 'FORBIDDEN' });
  }

  const permissionKeys = await getPermissionKeys(activeRoles.map(({ _id }) => _id));
  if (!permissionKeys.includes(permissionKey.toLowerCase())) {
    throw new HttpError(403, 'Insufficient permissions', { code: 'FORBIDDEN' });
  }

  await next();
};

module.exports = authorizePermission;
