const DocumentType = require("../models/DocumentType.model");

class DocumentTypeService {
  async register({ id, name, description }, { userId }) {
    const existingDocumentType = await DocumentType.findOne({ id });
    if (existingDocumentType) {
      throw new Error("DocumentType already exists");
    }
    const documentType = await DocumentType.create({
      id,
      name,
      description,
      userCreated: userId,
    });
    return {
      message: "DocumentType registered successfully",
      data: {
        documentType: { idDb: documentType._id, id, name, description },
      },
    };
  }

  async update({ id, name, description }, { userId }) {
    const documentType = await DocumentType.findOneAndUpdate(
      { id },
      { name, description, userUpdate: userId }
    );
    if (!documentType) {
      throw new Error("DocumentType not found");
    }
    return {
      message: "DocumentType updated successfully",
      data: {
        documentType: { idDb: documentType._id, id, name, description },
      },
    };
  }
  async getAll() {
    const allDocumentTypes = await DocumentType.find({ state: 1 });
    if (!allDocumentTypes) {
      throw new Error("Error fetching document types");
    }

    return {
      message: "Query successful",
      data: { documentTypes: allDocumentTypes },
    };
  }

  async getById(id) {
    const documentType = await DocumentType.findOne({ id, state: 1 });
    if (!documentType) {
      throw new Error("DocumentType not found");
    }
    return {
      message: "Query successful",
      data: {
        documentType: {
          _id: documentType._id,
          id: documentType.id,
          name: documentType.name,
          description: documentType.description,
        },
      },
    };
  }
}

module.exports = new DocumentTypeService();
