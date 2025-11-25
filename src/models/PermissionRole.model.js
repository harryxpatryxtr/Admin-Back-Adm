const mongoose = require("mongoose");
const PermissionRole = new mongoose.Schema(
  {
    id: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
    },
    permission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
    },
    state: {
        type: Number,
        default: 1, // 1: Active, 0: Inactive
    },
    lastLogin: {
        type: Date,
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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PermissionRole.methods.toPublicJSON = function () {
  return {
    idDb: this._id,
    id: this.id,
    role: this.role,
    permission: this.permission,
    state: this.state,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model("PermissionRole", PermissionRole);
