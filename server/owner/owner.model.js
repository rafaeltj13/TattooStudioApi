const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const errorMessages = require('../helpers/errorMessages');
const { constants } = require('../helpers/utils');
const Schema = mongoose.Schema;

const OwnerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, errorMessages.OWNER_PASSWORD_REQUIRED]
    },
    email: {
        type: String,
        match: [constants.USER.EMAIL_REGEX, errorMessages.OWNER_EMAIL_INVALID],
        required: [true, errorMessages.OWNER_EMAIL_REQUIRED],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        minlength: [constants.USER.NAME_MIN_LENGTH, errorMessages.OWNER_NAME_MIN_LENGTH],
        maxlength: [constants.USER.NAME_MAX_LENGTH, errorMessages.OWNER_NAME_MAX_LENGTH],
        required: [true, errorMessages.OWNER_NAME_REQUIRED]
    },
    age: {
        type: Number,
        required: [true, errorMessages.OWNER_AGE_REQUIRED]
    },
    gender: {
        type: String,
        required: [true, errorMessages.OWNER_GENDER_REQUIRED]
    },
    phone: {
        type: String,
        trim: true,
        required: [true, errorMessages.OWNER_PHONE_REQUIRED]
    },
    studio: {
        type: Schema.Types.ObjectId,
        ref: 'Studio',
        autopopulate: true
    },
    createdAt: Date,
    updatedAt: Date
});

OwnerSchema.plugin(require('mongoose-autopopulate'));

OwnerSchema.pre('save', next => {
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    next();
});

const preUpdate = (owner, next) => {
    delete owner.createdAt;
    owner.updatedAt = Date.now();
    next && next();
};

OwnerSchema.options.toJSON = {
    transform: function (doc, ret) {
        delete ret.__v;
    }
};

OwnerSchema.methods.getStudio = () => {
    return Promise.resolve(this);
};

OwnerSchema.statics.getById = id => {
    return this.findById(id)
        .exec()
        .then((owner) => {
            if (owner) {
                return owner;
            }
            const err = new APIError(errorMessages.OWNER_NOT_FOUND, httpStatus.NOT_FOUND);
            return Promise.reject(err);
        })
        .catch(erro => {
            if (!(erro instanceof APIError)) {
                erro = new APIError(errorMessages.OWNER_INVALID_ID, httpStatus.BAD_REQUEST);
            }
            return Promise.reject(erro);
        });
};

OwnerSchema.statics._findByIdAndUpdate = (ownerId, owner, options) => {
    preUpdate(owner);
    return this.findByIdAndUpdate(ownerId, owner, options)
};

module.exports = mongoose.model('Owner', OwnerSchema);