const Position= require("../models/Position.model");
const HttpError = require('../utils/http-error');

class PositionService {
  async register({ id, name, description }, { userId }) {
    const existingPosition = await Position.findOne({ id });
    if (existingPosition) {
      throw new HttpError(409, "Position already exists", { code: 'RESOURCE_EXISTS' });
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
      { id, state: 1 },
      { $set: { name, description, userUpdate: userId } },
      { new: true, runValidators: true },
    );
    if (!position) {
      throw new HttpError(404, "Position not found", { code: 'RESOURCE_NOT_FOUND' });
    }
    return {
      message: "Position updated successfully",
      data: {
        position: { idDb: position._id, id, name, description },
      },
    };
  }
  async getAll() {
    const allPositions = await Position.find({ state: 1 }).sort({ name: 1 }).exec();

    return {
      message: "Query successful",
      data: { positions: allPositions.map((position) => position.toPublicJSON()) },
    };
  }

  async getById(id) {
    const position = await Position.findOne({ id, state: 1 }).exec();
    if (!position) {
      throw new HttpError(404, "Position not found", { code: 'RESOURCE_NOT_FOUND' });
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
