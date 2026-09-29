const DocumentType = require("../models/DocumentType.model");
const HttpError = require('../utils/http-error');

class DocumentTypeService {
  async register({ id, name, description }, { userId }) {
    const existingDocumentType = await DocumentType.findOne({ id });
    if (existingDocumentType) {
      throw new HttpError(409, "Document type already exists", { code: 'RESOURCE_EXISTS' });
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
      { id, state: 1 },
      { $set: { name, description, userUpdate: userId } },
      { new: true, runValidators: true },
    );
    if (!documentType) {
      throw new HttpError(404, "Document type not found", { code: 'RESOURCE_NOT_FOUND' });
    }
    return {
      message: "DocumentType updated successfully",
      data: {
        documentType: { idDb: documentType._id, id, name, description },
      },
    };
  }
  async getAll() {
    const allDocumentTypes = await DocumentType.find({ state: 1 }).sort({ name: 1 }).exec();

    return {
      message: "Query successful",
      data: { documentTypes: allDocumentTypes.map((documentType) => documentType.toPublicJSON()) },
    };
  }

  async getById(id) {
    const documentType = await DocumentType.findOne({ id, state: 1 }).exec();
    if (!documentType) {
      throw new HttpError(404, "Document type not found", { code: 'RESOURCE_NOT_FOUND' });
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
