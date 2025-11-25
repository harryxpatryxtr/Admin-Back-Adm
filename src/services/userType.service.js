const UserType = require("../models/UserType.model");

class UserTypeService {
  async register({ id, name, description }, { userId }) {
    const existingUserType = await UserType.findOne({ id });
    if (existingUserType) {
      throw new Error("User Type already exists");
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
      { id },
      { name, description, userUpdate: userId }
    );
    if (!userType) {
      throw new Error("Domain not found");
    }
    return {
      message: "User Type updated successfully",
      data: {
        userType: { idDb: userType._id, id, name, description },
      },
    };
  }
  async getAll() {
    const allUserTypes = await UserType.find({ state: 1 });
    console.log("All User Types:", allUserTypes);
    if (!allUserTypes) {
      throw new Error("Error fetching user types");
    }

    return {
      message: "Query successful",
      data: { userTypes: allUserTypes },
    };
  }

  async getById(id) {
    const userType = await UserType.findOne({ id, state: 1 });
    if (!userType) {
      throw new Error("User Type not found");
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
