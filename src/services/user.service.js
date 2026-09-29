const bcrypt = require('bcrypt');
const { randomUUID } = require('node:crypto');
const User = require('../models/User.model');
const mongoose = require('mongoose');
const UserRole = require('../models/UserRole.model');
const Role = require('../models/Role.model');
const HttpError = require('../utils/http-error');

const PASSWORD_ROUNDS = 12;
const selectedUserFields = '+username +lastName';
const userFilter = (id) => (mongoose.isValidObjectId(id) ? { $or: [{ id }, { _id: id }] } : { id });

class UserService {
  async register(data, { userId }) {
    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { user: data.user }, { username: data.user }],
    });
    if (existingUser) {
      throw new HttpError(409, 'An account with these details already exists', { code: 'ACCOUNT_EXISTS' });
    }

    const user = await User.create({
      id: randomUUID(),
      user: data.user,
      email: data.email,
      password: await bcrypt.hash(data.password, PASSWORD_ROUNDS),
      firstName: data.firstName,
      paternalSurname: data.paternalSurname,
      maternalSurname: data.maternalSurname,
      userCreated: userId,
    });

    return { message: 'User created successfully', data: { user: user.toPublicJSON() } };
  }

  async update({ id, ...changes }, { userId }) {
    const user = await User.findOneAndUpdate(
      userFilter(id),
      { $set: { ...changes, userUpdate: userId } },
      { new: true, runValidators: true },
    ).select(selectedUserFields).exec();

    if (!user) {
      throw new HttpError(404, 'User not found', { code: 'USER_NOT_FOUND' });
    }

    return { message: 'User updated successfully', data: { user: user.toPublicJSON() } };
  }

  async getAll({ page = 1, limit = 25 } = {}) {
    const [users, total] = await Promise.all([
      User.find()
        .select(selectedUserFields)
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      User.countDocuments(),
    ]);

    return {
      message: 'Query successful',
      data: {
        users: users.map((user) => user.toPublicJSON()),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    };
  }

  async getById(id) {
    const user = await User.findOne(userFilter(id)).select(selectedUserFields).exec();
    if (!user) {
      throw new HttpError(404, 'User not found', { code: 'USER_NOT_FOUND' });
    }
    return { message: 'Query successful', data: { user: user.toPublicJSON() } };
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
}

module.exports = new UserService();
