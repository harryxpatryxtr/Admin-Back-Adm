const bcrypt = require('bcrypt');
const { randomUUID } = require('node:crypto');
const User = require('../models/User.model');
const mongoose = require('mongoose');
const UserRole = require('../models/UserRole.model');
const Role = require('../models/Role.model');
const HttpError = require('../utils/http-error');

const PASSWORD_ROUNDS = 12;
const selectedUserFields = '+username +lastName +role';
const catalogFields = 'id name';
const userFilter = (id) => (mongoose.isValidObjectId(id) ? { $or: [{ id }, { _id: id }] } : { id });

const populateCatalogs = (query) => query
  .populate('idTypeUser', catalogFields)
  .populate('idTypeDocument', catalogFields)
  .populate('idTypeCargo', catalogFields);

// Agrega a cada usuario sus roles activos (UserRole más los campos heredados idRole/role)
const withRoles = async (users) => {
  const assignments = await UserRole.find({ user: { $in: users.map(({ _id }) => _id) }, state: 1 })
    .select('user role')
    .lean();
  const roleIdsByUser = new Map(users.map((user) => [
    String(user._id),
    new Set([user.idRole, user.role].filter(Boolean).map(String)),
  ]));
  for (const { user, role } of assignments) {
    roleIdsByUser.get(String(user))?.add(String(role));
  }

  const allRoleIds = [...new Set([...roleIdsByUser.values()].flatMap((ids) => [...ids]))];
  const roles = await Role.find({ _id: { $in: allRoleIds }, state: 1 }).select('_id id name').lean();
  const rolesById = new Map(roles.map(({ _id, id, name }) => [String(_id), { idDb: _id, id, name }]));

  return users.map((user) => ({
    ...user.toPublicJSON(),
    roles: [...roleIdsByUser.get(String(user._id))].map((id) => rolesById.get(id)).filter(Boolean),
  }));
};

class UserService {
  async register(data, { userId }) {
    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { user: data.user }, { username: data.user }],
    });
    if (existingUser) {
      throw new HttpError(409, 'An account with these details already exists', { code: 'ACCOUNT_EXISTS' });
    }

    const { password, ...profile } = data;
    const user = await User.create({
      ...profile,
      id: randomUUID(),
      password: await bcrypt.hash(password, PASSWORD_ROUNDS),
      userCreated: userId,
    });

    const [created] = await withRoles([user]);
    return { message: 'User created successfully', data: { user: created } };
  }

  async update({ id, password, ...changes }, { userId }) {
    const target = await User.findOne(userFilter(id)).select('_id').exec();
    if (!target) {
      throw new HttpError(404, 'User not found', { code: 'USER_NOT_FOUND' });
    }
    if (changes.state === 0 && String(target._id) === userId) {
      throw new HttpError(400, 'You cannot deactivate your own account', { code: 'CANNOT_DEACTIVATE_SELF' });
    }

    const update = { $set: { ...changes, userUpdate: userId } };
    if (password) {
      update.$set.password = await bcrypt.hash(password, PASSWORD_ROUNDS);
    }
    // Una contraseña nueva o la desactivación cierran las sesiones abiertas
    if (password || changes.state === 0) {
      update.$unset = { refreshTokenHash: 1 };
    }

    const user = await populateCatalogs(User.findByIdAndUpdate(
      target._id,
      update,
      { new: true, runValidators: true },
    ).select(selectedUserFields)).exec();

    const [updated] = await withRoles([user]);
    return { message: 'User updated successfully', data: { user: updated } };
  }

  async getAll({ page = 1, limit = 25 } = {}) {
    const [users, total] = await Promise.all([
      populateCatalogs(User.find()
        .select(selectedUserFields)
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit))
        .exec(),
      User.countDocuments(),
    ]);

    return {
      message: 'Query successful',
      data: {
        users: await withRoles(users),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    };
  }

  async getById(id) {
    const user = await populateCatalogs(User.findOne(userFilter(id)).select(selectedUserFields)).exec();
    if (!user) {
      throw new HttpError(404, 'User not found', { code: 'USER_NOT_FOUND' });
    }
    const [found] = await withRoles([user]);
    return { message: 'Query successful', data: { user: found } };
  }

  async assignRole({ id, roleId }, { userId }) {
    const [user, role] = await Promise.all([
      User.findOne(userFilter(id)).exec(),
      Role.findOne({ _id: roleId, state: 1 }).exec(),
    ]);

    if (!user) {
      throw new HttpError(404, 'User not found', { code: 'USER_NOT_FOUND' });
    }
    if (!role) {
      throw new HttpError(404, 'Active role not found', { code: 'ROLE_NOT_FOUND' });
    }

    const assignment = await UserRole.findOne({ user: user._id, role: role._id }).exec();
    if (assignment) {
      if (assignment.state === 1) {
        throw new HttpError(409, 'Role is already assigned to this user', { code: 'ROLE_ALREADY_ASSIGNED' });
      }
      assignment.state = 1;
      assignment.userUpdate = userId;
      await assignment.save();
    } else {
      await UserRole.create({
        id: randomUUID(),
        user: user._id,
        role: role._id,
        userCreated: userId,
      });
    }

    return { message: 'Role assigned to user successfully' };
  }

  async unassignRole({ id, roleId }, { userId }) {
    const user = await User.findOne(userFilter(id)).select('_id idRole +role').exec();
    if (!user) {
      throw new HttpError(404, 'User not found', { code: 'USER_NOT_FOUND' });
    }

    const assignment = await UserRole.findOneAndUpdate(
      { user: user._id, role: roleId, state: 1 },
      { $set: { state: 0, userUpdate: userId } },
    ).exec();
    // El rol también puede venir de los campos heredados
    const legacy = {};
    if (String(user.idRole) === roleId) legacy.idRole = 1;
    if (String(user.role) === roleId) legacy.role = 1;
    if (Object.keys(legacy).length) {
      await User.updateOne({ _id: user._id }, { $unset: legacy });
    }

    if (!assignment && !Object.keys(legacy).length) {
      throw new HttpError(404, 'Role is not assigned to this user', { code: 'ROLE_NOT_ASSIGNED' });
    }
    return { message: 'Role removed from user successfully' };
  }
}

module.exports = new UserService();
