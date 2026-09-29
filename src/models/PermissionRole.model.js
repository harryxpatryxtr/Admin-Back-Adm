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
        required: true,
    },
    permission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
        required: true,
    },
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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PermissionRole.index({ role: 1, permission: 1 }, { unique: true });

PermissionRole.methods.toPublicJSON = function () {
  return {
    idDb: this._id,
    id: this.id,
    role: this.role,
    permission: this.permission,
    state: this.state,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model("PermissionRole", PermissionRole);
