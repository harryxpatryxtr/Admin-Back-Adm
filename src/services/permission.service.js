const Permission= require("../models/Permission.model");
const HttpError = require('../utils/http-error');

class PermissionService {
  async register({ id, name, description }, { userId }) {
    const existingPermission = await Permission.findOne({ id });
    if (existingPermission) {
      throw new HttpError(409, "Permission already exists", { code: 'RESOURCE_EXISTS' });
    }
    const permission = await Permission.create({
      id,
      name,
      description,
      userCreated: userId,
    });
    return {
      message: "Permission registered successfully",
      data: {
        permission: { idDb: permission._id, id, name, description },
      },
    };
  }

  async update({ id, name, description }, { userId }) {
    const permission = await Permission.findOneAndUpdate(
      { id, state: 1 },
      { $set: { name, description, userUpdate: userId } },
      { new: true, runValidators: true },
    );
    if (!permission) {
      throw new HttpError(404, "Permission not found", { code: 'RESOURCE_NOT_FOUND' });
    }
    return {
      message: "Permission updated successfully",
      data: {
        permission: { idDb: permission._id, id, name, description },
      },
    };
  }
  async getAll() {
    const allPermissions = await Permission.find({ state: 1 }).sort({ name: 1 }).exec();

    return {
      message: "Query successful",
      data: { permissions: allPermissions.map((permission) => permission.toPublicJSON()) },
    };
  }

  async getById(id) {
    const permission = await Permission.findOne({ id, state: 1 }).exec();
    if (!permission) {
      throw new HttpError(404, "Permission not found", { code: 'RESOURCE_NOT_FOUND' });
    }
    return {
      message: "Query successful",
      data: {
        permission: {
          _id: permission._id,
          id: permission.id,
          name: permission.name,
          description: permission.description,
        },
      },
    };
  }
}

module.exports = new PermissionService();
