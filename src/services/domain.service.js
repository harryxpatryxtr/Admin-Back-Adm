const Domain = require("../models/Domain.model");

class DomainService {
  async register({ id, name, description }, { userId }) {
    const existingDomain = await Domain.findOne({ id });
    if (existingDomain) {
      throw new Error("Domain already exists");
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
      { id },
      { name, description, userUpdate: userId }
    );
    if (!domain) {
      throw new Error("Domain not found");
    }
    return {
      message: "Domain updated successfully",
      data: {
        domain: { idDb: domain._id, id, name, description },
      },
    };
  }
  async getAll() {
    const allDomains = await Domain.find({ state: 1 });
    if (!allDomains) {
      throw new Error("Error fetching domains");
    }

    return {
      message: "Query successful",
      data: { domains: allDomains },
    };
  }

  async getById(id) {
    const domain = await Domain.findOne({ id, state: 1 });
    if (!domain) {
      throw new Error("Domain not found");
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
