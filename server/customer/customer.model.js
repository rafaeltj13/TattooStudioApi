const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const APIError = require('../helpers/APIError');
const errorMessages = require('../helpers/errorMessages')
const { constants } = require('../helpers/utils');
const { validatePassword } = require('../helpers/validator')

const CustomerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, errorMessages.COSTUMER_PASSWORD_REQUIRED]
    },
    email: {
        type: String,
        match: [constants.COSTUMER.EMAIL_REGEX, errorMessages.COSTUMER_EMAIL_INVALID],
        required: [true, errorMessages.COSTUMER_EMAIL_REQUIRED],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        minlength: [constants.COSTUMER.NAME_MIN_LENGTH, errorMessages.COSTUMER_NAME_MIN_LENGTH],
        maxlength: [constants.COSTUMER.NAME_MAX_LENGTH, errorMessages.COSTUMER_NAME_MAX_LENGTH],
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
        // match: [constants.COSTUMER.PHONE_NO_REGEX, errorMessages.COSTUMER_PHONE_INVALID],
        trim: true,
        required: [true, errorMessages.COSTUMER_PHONE_REQUIRED]
    },
    photo: String,
    createdAt: Date,
    updatedAt: Date
});

CustomerSchema.pre('save', function (next) {
    const errorMsg = validatePassword(this.password);
    if (errorMsg) {
        const passwordError = new APIError(errorMsg, httpStatus.BAD_REQUEST, true);
        return next(passwordError);
    }
    const jump = 10;
    const passwordHash = bcrypt.hashSync(this.password, jump);
    this.password = passwordHash;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    next();
});

const preUpdate = (customer, next) => {
    delete customer.password;
    delete customer.createdAt;
    customer.updatedAt = Date.now();
    next && next();
};

CustomerSchema.options.toJSON = {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
    }
};

CustomerSchema.methods.getCustomer = function () {
    return Promise.resolve(this);
};

CustomerSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

CustomerSchema.statics.getByUserName = function (username) {
    return this.findOne({ username })
        .exec()
        .then(customer => {
            if (customer) {
                return customer;
            }
            const err = new APIError(errorMessages.COSTUMER_NOT_FOUND, httpStatus.NOT_FOUND);
            return Promise.reject(err);
        });
};

CustomerSchema.statics._findByIdAndUpdate = function (idCustomer, customer, options) {
    preUpdate(customer);
    return this.findByIdAndUpdate(idCustomer, customer, options)
};

module.exports = mongoose.model('Customer', CustomerSchema);