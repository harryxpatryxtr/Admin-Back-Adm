const mongoose = require("mongoose");
const UserRole = new mongoose.Schema(
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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

UserRole.index({ user: 1, role: 1 }, { unique: true });

UserRole.methods.toPublicJSON = function () {
  return {
    idDb: this._id,
    id: this.id,
    role: this.role,
    user: this.user,
    state: this.state,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model("UserRole", UserRole);
