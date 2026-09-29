const { randomUUID } = require('node:crypto');
const Role = require('../models/Role.model');
const Permission = require('../models/Permission.model');
const PermissionRole = require('../models/PermissionRole.model');
const HttpError = require('../utils/http-error');

class RoleService {
  async register({ id, name, description }, { userId }) {
    const existingRole = await Role.findOne({ id }).exec();
    if (existingRole) {
      throw new HttpError(409, 'Role already exists', { code: 'RESOURCE_EXISTS' });
    }

    const role = await Role.create({ id, name, description, userCreated: userId });
    return {
      message: 'Role registered successfully',
      data: { role: { idDb: role._id, id: role.id, name: role.name, description: role.description } },
    };
  }

  async update({ id, name, description }, { userId }) {
    const role = await Role.findOneAndUpdate(
      { id, state: 1 },
      { $set: { name, description, userUpdate: userId } },
      { new: true, runValidators: true },
    ).exec();
    if (!role) {
      throw new HttpError(404, 'Role not found', { code: 'RESOURCE_NOT_FOUND' });
    }
    return {
      message: 'Role updated successfully',
      data: { role: { idDb: role._id, id: role.id, name: role.name, description: role.description } },
    };
  }

  async getAll() {
    const roles = await Role.find({ state: 1 }).sort({ name: 1 }).exec();
    return { message: 'Query successful', data: { roles: roles.map((role) => role.toPublicJSON()) } };
  }

  async getById(id) {
    const role = await Role.findOne({ id, state: 1 }).exec();
    if (!role) {
      throw new HttpError(404, 'Role not found', { code: 'RESOURCE_NOT_FOUND' });
    }
    return {
      message: 'Query successful',
      data: { role: { _id: role._id, id: role.id, name: role.name, description: role.description } },
    };
  }

  async setPermission({ roleId, permissionId }, { userId }) {
    const [role, permission] = await Promise.all([
      Role.findOne({ _id: roleId, state: 1 }).exec(),
      Permission.findOne({ _id: permissionId, state: 1 }).exec(),
    ]);
    if (!role) {
      throw new HttpError(404, 'Active role not found', { code: 'ROLE_NOT_FOUND' });
    }
    if (!permission) {
      throw new HttpError(404, 'Active permission not found', { code: 'PERMISSION_NOT_FOUND' });
    }

    const assignment = await PermissionRole.findOne({ role: role._id, permission: permission._id }).exec();
    if (assignment?.state === 1) {
      throw new HttpError(409, 'Permission is already assigned to this role', { code: 'PERMISSION_ALREADY_ASSIGNED' });
    }
    if (assignment) {
      assignment.state = 1;
      assignment.userUpdate = userId;
      await assignment.save();
    } else {
      await PermissionRole.create({
        id: randomUUID(),
        role: role._id,
        permission: permission._id,
        userCreated: userId,
      });
    }

    return { message: 'Permission assigned to role successfully' };
  }

  async deletePermission(id, { userId }) {
    const assignment = await PermissionRole.findOneAndUpdate(
      { id, state: 1 },
      { $set: { state: 0, userUpdate: userId } },
      { new: true, runValidators: true },
    ).exec();
    if (!assignment) {
      throw new HttpError(404, 'Permission assignment not found', { code: 'ASSIGNMENT_NOT_FOUND' });
    }
    return { message: 'Permission removed from role successfully' };
  }

  async getPermissionsByRole(roleId) {
    const role = await Role.findOne({ _id: roleId, state: 1 }).select('_id').exec();
    if (!role) {
      throw new HttpError(404, 'Active role not found', { code: 'ROLE_NOT_FOUND' });
    }

    const assignments = await PermissionRole.find({ role: role._id, state: 1 })
      .populate({ path: 'permission', match: { state: 1 }, select: 'id name description' })
      .exec();
    return {
      message: 'Query successful',
      data: { permissions: assignments.filter(({ permission }) => permission).map((item) => item.toPublicJSON()) },
    };
  }
}

module.exports = new RoleService();
