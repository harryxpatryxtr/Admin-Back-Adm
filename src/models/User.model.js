const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    id:{ type: String,
        required: true,
    },
    idParentCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },

idTypeUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserType",
},
idTypeDocument: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DocumentType",
},
idTypeCargo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Position",
},
    user: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must be less than 30 characters"],
    },
    // Legacy fields remain readable while existing records are migrated.
    username: {
      type: String,
      select: false,
    },
    lastName: {
      type: String,
      trim: true,
      select: false,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      select: false,
    },
    idRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    documentNumber: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    paternalSurname: {
      type: String,
      trim: true,
    },
    maternalSurname: {
      type: String,
      trim: true,
    },
    sex: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    cellphone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [12, "Password must be at least 12 characters"],
      select: false,
    },
    refreshTokenHash: {
      type: String,
      select: false,
    },
    photo: {
      type: String,
    },   state: {
        type: Number,
        enum: [0, 1],
        default: 1, // 1: Active, 0: Inactive
    },
    isActive: {
      type: Boolean,
      select: false,
    },
    userCreated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userUpdate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.password;
        delete ret.refreshTokenHash;
        delete ret.username;
        delete ret.lastName;
        delete ret.role;
        delete ret.isActive;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.password;
        delete ret.refreshTokenHash;
        delete ret.username;
        delete ret.lastName;
        delete ret.role;
        delete ret.isActive;
        return ret;
      },
    },
  }
);
userSchema.index(
  { id: 1 },
  { unique: true, partialFilterExpression: { id: { $type: 'string' } } },
);
userSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { user: { $type: 'string' } } },
);
// Virtual para nombre completo
userSchema.virtual("fullName").get(function () {
  return `${this.firstName || ""} ${this.paternalSurname || this.lastName || ""} ${this.maternalSurname || ""}`.trim();
});
userSchema.methods.toPublicJSON = function () {
  return {
   idDb: this._id,
   id: this.id || this._id.toString(),
   idParentCompany: this.idParentCompany,
   idTypeUser: this.idTypeUser,
   idTypeDocument: this.idTypeDocument,
   idTypeCargo: this.idTypeCargo,
   user: this.user || this.username,
   idRole: this.idRole,
   documentNumber: this.documentNumber,
   firstName: this.firstName,
   paternalSurname: this.paternalSurname,
   maternalSurname: this.maternalSurname,
   sex: this.sex,
    email: this.email,
    cellphone: this.cellphone,
    photo: this.photo,
   fullName: this.fullName,
   state: this.state,
   createdAt: this.createdAt,
   userCreated: this.userCreated,
   userUpdate: this.userUpdate,
  };
};

module.exports = mongoose.model("User", userSchema);
