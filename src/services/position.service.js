const Position= require("../models/Position.model");

class PositionService {
  async register({ id, name, description }, { userId }) {
    const existingPosition = await Position.findOne({ id });
    if (existingPosition) {
      throw new Error("Position already exists");
    }
    const position = await Position.create({
      id,
      name,
      description,
      userCreated: userId,
    });
    return {
      message: "Position registered successfully",
      data: {
        position: { idDb: position._id, id, name, description },
      },
    };
  }

  async update({ id, name, description }, { userId }) {
    const position = await Position.findOneAndUpdate(
      { id },
      { name, description, userUpdate: userId }
    );
    if (!position) {
      throw new Error("Position not found");
    }
    return {
      message: "Position updated successfully",
      data: {
        position: { idDb: position._id, id, name, description },
      },
    };
  }
  async getAll() {
    const allPositions = await Position.find({ state: 1 }).populate(
      "userCreated",
      "name email"
    ).populate(
      "userUpdate",
      "name email"
    );;
    if (!allPositions) {
      throw new Error("Error fetching positions");
    }

    return {
      message: "Query successful",
      data: { positions: allPositions },
    };
  }

  async getById(id) {
    const position = await Position.findOne({ id, state: 1 }).populate(
      "userCreated",
      "name email"
    ).populate(
      "userUpdate",
      "name email"
    );
    if (!position) {
      throw new Error("Position not found");
    }
    return {
      message: "Query successful",
      data: {
        position: {
          _id: position._id,
          id: position.id,
          name: position.name,
          description: position.description,
        },
      },
    };
  }
}

module.exports = new PositionService();
