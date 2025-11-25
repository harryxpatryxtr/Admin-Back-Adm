const mongoose = require("mongoose");
const domainSchema = new mongoose.Schema(
  {
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    description: String,
    state: {
        type: Number,
        default: 1, // 1: Active, 0: Inactive
    },
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
domainSchema.methods.toPublicJSON = function () {
  return {
    idDb: this._id,
    id: this.id,
    name: this.name,
    description: this.description,
    state: this.state,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model("UserType", domainSchema);
