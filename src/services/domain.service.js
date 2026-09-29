const Domain = require("../models/Domain.model");
const HttpError = require('../utils/http-error');

class DomainService {
  async register({ id, name, description }, { userId }) {
    const existingDomain = await Domain.findOne({ id });
    if (existingDomain) {
      throw new HttpError(409, "Domain already exists", { code: 'RESOURCE_EXISTS' });
    }
    const domain = await Domain.create({
      id,
      name,
      description,
      userCreated: userId,
    });
    return {
      message: "Domain registered successfully",
      data: {
        domain: { idDb: domain._id, id, name, description },
      },
    };
  }

  async update({ id, name, description }, { userId }) {
    const domain = await Domain.findOneAndUpdate(
      { id, state: 1 },
      { $set: { name, description, userUpdate: userId } },
      { new: true, runValidators: true },
    );
    if (!domain) {
      throw new HttpError(404, "Domain not found", { code: 'RESOURCE_NOT_FOUND' });
    }
    return {
      message: "Domain updated successfully",
      data: {
        domain: { idDb: domain._id, id, name, description },
      },
    };
  }
  async getAll() {
    const allDomains = await Domain.find({ state: 1 }).sort({ name: 1 }).exec();

    return {
      message: "Query successful",
      data: { domains: allDomains.map((domain) => domain.toPublicJSON()) },
    };
  }

  async getById(id) {
    const domain = await Domain.findOne({ id, state: 1 }).exec();
    if (!domain) {
      throw new HttpError(404, "Domain not found", { code: 'RESOURCE_NOT_FOUND' });
    }
    return {
      message: "Query successful",
      data: {
        domain: {
          _id: domain._id,
          id: domain.id,
          name: domain.name,
          description: domain.description,
        },
      },
    };
  }
}

module.exports = new DomainService();
