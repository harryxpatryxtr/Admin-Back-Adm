const PermissionRole = require('../models/PermissionRole.model');
const Role = require('../models/Role.model');
const UserRole = require('../models/UserRole.model');

// Roles activos de una cuenta: asignaciones en UserRole más los campos heredados idRole/role
const getActiveRoles = async (account) => {
  const linkedRoles = await UserRole.find({ user: account._id, state: 1 })
    .select('role')
    .lean();
  const roleIds = [account.idRole, account.role, ...linkedRoles.map(({ role }) => role)]
    .filter(Boolean)
    .map(String);
  if (roleIds.length === 0) return [];
  return Role.find({ _id: { $in: [...new Set(roleIds)] }, state: 1 })
    .select('_id id name')
    .lean();
};

// Claves de permiso (id y name en minúsculas) concedidas por los roles indicados
const getPermissionKeys = async (roleIds) => {
  if (roleIds.length === 0) return [];
  const assignments = await PermissionRole.find({ role: { $in: roleIds }, state: 1 })
    .populate({ path: 'permission', match: { state: 1 }, select: 'id name' })
    .select('permission')
    .lean();
  const keys = assignments
    .filter(({ permission }) => permission)
    .flatMap(({ permission }) => [permission.id, permission.name])
    .filter(Boolean)
    .map((value) => value.toLowerCase());
  return [...new Set(keys)];
};

const getAccess = async (account) => {
  const roles = await getActiveRoles(account);
  const permissions = await getPermissionKeys(roles.map(({ _id }) => _id));
  return {
    roles: roles.map(({ _id, id, name }) => ({ idDb: _id, id, name })),
    permissions,
  };
};

module.exports = { getActiveRoles, getPermissionKeys, getAccess };
