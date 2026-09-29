const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({

idParentCompany:{
    type: String,
    required  : true,
},
glnParentCompany:{
    type: String,
},
parentCompany:{
    type: String,
},
parentCompanyRuc:{
    type: String,
},
parentCompanyUbigeo:{
    type: String,
},
parentCompanyAddress:{
    type: String,
},
parentCompanyLocation:{
    type: String,
},
parentCompanyContactEmail:{
    type: String,
},
parentCompanyContactCellular:{
    type: String,
},
parentCompanyWeb:{
    type: String,
},
logo:{
    type: String,
},
   state: {
        type: Number,
        default: 1, // 1: Active, 0: Inactive
    },
userCreated:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
},
userUpdate:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
}},
{
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
);

companySchema.methods.toPublicJSON = function () {
    return {
    idDb: this._id,
    idParentCompany: this.idParentCompany,
    glnParentCompany: this.glnParentCompany,
    parentCompany: this.parentCompany,
    parentCompanyRuc: this.parentCompanyRuc,
    parentCompanyUbigeo: this.parentCompanyUbigeo,
    parentCompanyAddress: this.parentCompanyAddress,
    parentCompanyLocation: this.parentCompanyLocation,
    parentCompanyContactEmail: this.parentCompanyContactEmail,
    parentCompanyContactCellular: this.parentCompanyContactCellular,
    parentCompanyWeb: this.parentCompanyWeb,
    logo: this.logo,
    state: this.state,
    createdAt: this.createdAt
    };
}

module.exports = mongoose.model('Company', companySchema);
