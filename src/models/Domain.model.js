const mongoose = require("mongoose");
const domainSchema = new mongoose.Schema(
  {
    identityId: String,
    name: String,
    description: String,
    state: Number,
    userCreated: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    userUpdate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Método para ocultar datos sensibles
domainSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    identityId: this.identityId,
    name: this.name,
    description: this.description,
    state: this.state,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model("Domain", domainSchema);
