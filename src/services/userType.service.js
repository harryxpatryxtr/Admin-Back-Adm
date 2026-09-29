const UserType = require("../models/UserType.model");
const HttpError = require('../utils/http-error');

class UserTypeService {
  async register({ id, name, description }, { userId }) {
    const existingUserType = await UserType.findOne({ id });
    if (existingUserType) {
      throw new HttpError(409, "User Type already exists", { code: 'RESOURCE_EXISTS' });
    }
    const userType = await UserType.create({
      id,
      name,
      description,
      userCreated: userId,
    });
    return {
      message: "User Type registered successfully",
      data: {
        userType: { idDb: userType._id, id, name, description },
      },
    };
  }

  async update({ id, name, description }, { userId }) {
    const userType = await UserType.findOneAndUpdate(
      { id, state: 1 },
      { $set: { name, description, userUpdate: userId } },
      { new: true, runValidators: true },
    );
    if (!userType) {
      throw new HttpError(404, "User type not found", { code: 'RESOURCE_NOT_FOUND' });
    }
    return {
      message: "User Type updated successfully",
      data: {
        userType: { idDb: userType._id, id, name, description },
      },
    };
  }
  async getAll() {
    const allUserTypes = await UserType.find({ state: 1 }).sort({ name: 1 }).exec();

    return {
      message: "Query successful",
      data: { userTypes: allUserTypes.map((userType) => userType.toPublicJSON()) },
    };
  }

  async getById(id) {
    const userType = await UserType.findOne({ id, state: 1 }).exec();
    if (!userType) {
      throw new HttpError(404, "User type not found", { code: 'RESOURCE_NOT_FOUND' });
    }
    return {
      message: "Query successful",
      data: {
        userType: {
          _id: userType._id,
          id: userType.id,
          name: userType.name,
          description: userType.description,
        },
      },
    };
  }
}

module.exports = new UserTypeService();
