const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must be less than 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, "First name must be less than 50 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, "Last name must be less than 50 characters"],
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Virtual para nombre completo
userSchema.virtual("fullName").get(function () {
  return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    fullName: this.fullName,
    avatar: this.avatar,
    role: this.role,
    isActive: this.isActive,
    isEmailVerified: this.isEmailVerified,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
