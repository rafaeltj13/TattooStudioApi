const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const APIError = require('../helpers/APIError');
const errorMessages = require('../helpers/errorMessages')
const constants = require('../helpers/constants');

const CostumerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, errorMessages.USER.REQUIRED_PASSWORD]
    },
    email: {
        type: String,
        match: [constants.EMAIL_REGEX, errorMessages.COSTUMER_EMAIL_INVALID],
        required: [true, errorMessages.COSTUMER_EMAIL_REQUIRED],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        minlength: [constants.NOME_COMPLETO_USUARIO_TAMANHO_MINIMO, errorMessages.COSTUMER_NAME_MIN_LENGTH],
        maxlength: [constants.NOME_COMPLETO_USUARIO_TAMANHO_MAXIMO, errorMessages.COSTUMER_NAME_MAX_LENGTH],
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        /* XX9XXXXXXXX ou XXXXXXXXXX */
        match: [constants.PHONE_NO_REGEX, errorMessages.COSTUMER_PHONE_INVALID],
        trim: true,
        required: [true, errorMessages.COSTUMER_PHONE_REQUIRED]
    },
    photo: String,
    createdAt: Date,
    updatedAt: Date
});

CostumerSchema.pre('save', function (next) {
    const jump = 10;
    const passwordHash = bcrypt.hashSync(this.password, jump);
    this.password = passwordHash;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    next();
});

const preUpdate = (costumer, next) => {
    delete costumer.password;
    delete costumer.createdAt;
    costumer.updatedAt = Date.now();
    next && next();
};

CostumerSchema.options.toJSON = {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
    }
};

CostumerSchema.methods.getCostumer = function() {
    return Promise.resolve(this);
};

CostumerSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

CostumerSchema.statics.statics._findByIdAndUpdate = function(idCostumer, costumer, options) {
    preUpdate(costumer);
    return this.findByIdAndUpdate(idCostumer, costumer, options)
};

module.exports = mongoose.model('Costumer', CostumerSchema);