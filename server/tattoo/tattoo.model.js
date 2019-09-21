const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const errorMessages = require('../helpers/errorMessages')
const { constants } = require('../helpers/utils');

const TattooSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, errorMessages.TATTOO_IMAGE_REQUIRED]
    },
    place: {
        type: String,
        required: [true, errorMessages.TATTOO_PLACE_REQUIRED]
    }
    size: {
        type: Number,
        required: [true, errorMessages.TATTOO_SIZE_REQUIRED]
    }
    createdAt: Date,
    updatedAt: Date
});

TattooSchema.pre('save', next => {
    this.dataCriacao = Date.now();
    this.dataEdicao = Date.now();
    next();
});

const preUpdate = (tattoo, next) => {
    delete tattoo.dataCriacao;
    tattoo.dataEdicao = Date.now();
    next && next();
};

TattooSchema.options.toJSON = {
    transform: function (doc, ret) {
        delete ret.__v;
    }
};

TattooSchema.methods.getTattoo = () => {
    return Promise.resolve(this);
};

TattooSchema.statics.getById = id => {
    return this.findById(id)
      .exec()
      .then((tattoo) => {
        if (tattoo) {
          return tattoo;
        }
        const err = new APIError(errorMessages.TATTOO_NOT_FOUND, httpStatus.NOT_FOUND);
        return Promise.reject(err);
      })
      .catch(erro => {
        if (!(erro instanceof APIError)) {
          erro = new APIError(errorMessages.TATTOO_INVALID_ID, httpStatus.BAD_REQUEST);
        }
        return Promise.reject(erro);
      });
};

TattooSchema.statics._findByIdAndUpdate = (idTattoo, tattoo, options) => {
    preUpdate(tattoo);
    return this.findByIdAndUpdate(idTattoo, tattoo, options)
};

module.exports = mongoose.model('Tattoo', TattooSchema);