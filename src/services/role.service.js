const Role = require("../models/Role.model");
const PermissionRole = require("../models/PermissionRole.model");

class RoleService {
  async register({ id, name, description }, { userId }) {
    const existingRole = await Role.findOne({ id });
    if (existingRole) {
      throw new Error("Permission already exists");
    }
    const permission = await Role.create({
      id,
      name,
      description,
      userCreated: userId,
    });
    return {
      message: "Role registered successfully",
      data: {
        role: { idDb: permission._id, id, name, description },
      },
    };
  }

  async update({ id, name, description }, { userId }) {
    const role = await Role.findOneAndUpdate(
      { id },
      { name, description, userUpdate: userId }
    );
    if (!role) {
      throw new Error("Role not found");
    }
    return {
      message: "Role updated successfully",
      data: {
        role: { idDb: role._id, id, name, description },
      },
    };
  }
  async getAll() {
    const allRoles = await Role.find({ state: 1 }).populate(
      "userCreated",
      "name email"
    ).populate(
      "userUpdate",
      "name email"
    );
    if (!allRoles) {
      throw new Error("Error fetching roles");
    }

    return {
      message: "Query successful",
      data: { roles: allRoles },
    };
  }

  async getById(id) {
    const role = await Role.findOne({ id, state: 1 }).populate(
      "userCreated",
      "name email"
    ).populate(
      "userUpdate",
      "name email"
    );
    if (!role) {
      throw new Error("Permission not found");
    }
    return {
      message: "Query successful",
      data: {
        permission: {
          _id: role._id,
          id: role.id,
          name: role.name,
          description: role.description,
        },
      },
    };
  }

  async setPermission({ id, roleId, permissionId }, { userId }) {
    const permissionRole = await PermissionRole.findOne({
      id,
      role: roleId,
      permission: permissionId,
    });
    console.log("Existing permissionRole:", permissionRole);
    if (permissionRole) {
      if (permissionRole.state === 0) {
        await PermissionRole.findOneAndUpdate(
          { roleId, permissionId },
          { state: 1, userUpdate: userId }
        );
        return {
          message: "Permission reactivated successfully",
        };
      } else {
        throw new Error("Permission already assigned to role");
      }
    }
    await PermissionRole.create({id,
      role: roleId,
      permission: permissionId,
      userCreated: userId,
    });
    return {
      message: "Permission assigned to role successfully",
    };
  }

  async deletePermission(id  , { userId }) {
    console.log("deletePermission called with:", id, userId);
    const permissionRole = await PermissionRole.findOne({ id })
    
      console.log(permissionRole);
  
     if (!permissionRole ) {
       throw new Error("Role not found");
     }
    await PermissionRole.findOneAndUpdate(
      { id },
      { state: 0, userUpdate: userId }
    );
    return {
      message: "Permission removed from role successfully",
    };  
  }
}

module.exports = new RoleService();
