const Permission= require("../models/Permission.model");

class PermissionService {
  async register({ id, name, description }, { userId }) {
    const existingPermission = await Permission.findOne({ id });
    if (existingPermission) {
      throw new Error("Permission already exists");
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
      { id },
      { name, description, userUpdate: userId }
    );
    if (!permission) {
      throw new Error("Permission not found");
    }
    return {
      message: "Permission updated successfully",
      data: {
        permission: { idDb: permission._id, id, name, description },
      },
    };
  }
  async getAll() {
    const allPermissions = await Permission.find({ state: 1 }).populate(
      "userCreated",
      "name email"
    ).populate(
      "userUpdate",
      "name email"
    );
    if (!allPermissions) {
      throw new Error("Error fetching permissions");
    }

    return {
      message: "Query successful",
      data: { permissions: allPermissions },
    };
  }

  async getById(id) {
    const permission = await Permission.findOne({ id, state: 1 }).populate(
      "userCreated",
      "name email"
    ).populate(
      "userUpdate",
      "name email"
    );
    if (!permission) {
      throw new Error("Permission not found");
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
