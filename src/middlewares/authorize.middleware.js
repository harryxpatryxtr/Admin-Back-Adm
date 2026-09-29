const PermissionRole = require('../models/PermissionRole.model');
const Role = require('../models/Role.model');
const UserRole = require('../models/UserRole.model');
const HttpError = require('../utils/http-error');

const authorizePermission = (permissionKey) => async (ctx, next) => {
  const account = ctx.state.account;
  const linkedRoles = await UserRole.find({ user: account._id, state: 1 })
    .select('role')
    .lean();
  const roleIds = [account.idRole, account.role, ...linkedRoles.map(({ role }) => role)]
    .filter(Boolean)
    .map(String);
  const activeRoles = roleIds.length
    ? await Role.find({ _id: { $in: [...new Set(roleIds)] }, state: 1 }).select('_id').lean()
    : [];
  const activeRoleIds = activeRoles.map(({ _id }) => _id);

  if (activeRoleIds.length === 0) {
    throw new HttpError(403, 'Insufficient permissions', { code: 'FORBIDDEN' });
  }

  const assignments = await PermissionRole.find({ role: { $in: activeRoleIds }, state: 1 })
    .populate({ path: 'permission', match: { state: 1 }, select: 'id name' })
    .select('permission')
    .lean();
  const normalizedKey = permissionKey.toLowerCase();
  const isAllowed = assignments.some(({ permission }) => {
    if (!permission) return false;
    return [permission.id, permission.name]
      .filter(Boolean)
      .some((value) => value.toLowerCase() === normalizedKey);
  });

  if (!isAllowed) {
    throw new HttpError(403, 'Insufficient permissions', { code: 'FORBIDDEN' });
  }

  await next();
};

module.exports = authorizePermission;
