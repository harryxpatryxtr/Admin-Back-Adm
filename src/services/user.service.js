const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const Role = require("../models/Role.model");

const HIDDEN_FIELDS = "-password -refreshToken";

class UserService {
  async ensureRole(roleId) {
    const role = await Role.findOne({ _id: roleId, state: 1 });
    if (!role) {
      throw new Error("Role not found");
    }
  }

  async ensureUnique({ username, email }, excludeId) {
    const or = [];
    if (username) or.push({ username });
    if (email) or.push({ email: email.toLowerCase() });
    if (or.length === 0) return;
    const filter = excludeId ? { $or: or, _id: { $ne: excludeId } } : { $or: or };
    const existingUser = await User.findOne(filter);
    if (existingUser) {
      throw new Error("Username or email already in use");
    }
  }

  async findPublic(id) {
    return User.findById(id).select(HIDDEN_FIELDS).populate("role", "id name");
  }

  async register({ username, email, password, firstName, lastName, role }) {
    await this.ensureUnique({ username, email });
    await this.ensureRole(role);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    });
    return {
      message: "User registered successfully",
      data: { user: await this.findPublic(user._id) },
    };
  }

  async update({ id, password, role, ...fields }) {
    await this.ensureUnique(fields, id);
    if (role) {
      await this.ensureRole(role);
    }

    const changes = { ...fields };
    if (role) changes.role = role;
    if (password) changes.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(id, changes, { runValidators: true });
    if (!user) {
      throw new Error("User not found");
    }
    return {
      message: "User updated successfully",
      data: { user: await this.findPublic(id) },
    };
  }

  async getAll() {
    // Devuelve activos e inactivos para poder reactivarlos desde el admin
    const allUsers = await User.find()
      .select(HIDDEN_FIELDS)
      .populate("role", "id name")
      .sort({ createdAt: -1 });

    return {
      message: "Query successful",
      data: { users: allUsers },
    };
  }

  async getById(id) {
    const user = await this.findPublic(id);
    if (!user) {
      throw new Error("User not found");
    }
    return {
      message: "Query successful",
      data: { user },
    };
  }
}

module.exports = new UserService();
