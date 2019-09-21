const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const APIError = require('../helpers/APIError');
const errorMessages = require('../helpers/errorMessages')
const { constants } = require('../helpers/utils');
const { validatePassword } = require('../helpers/validator');

const CustomerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, errorMessages.CUSTOMER_PASSWORD_REQUIRED]
    },
    email: {
        type: String,
        match: [constants.USER.EMAIL_REGEX, errorMessages.CUSTOMER_EMAIL_INVALID],
        required: [true, errorMessages.CUSTOMER_EMAIL_REQUIRED],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        minlength: [constants.USER.NAME_MIN_LENGTH, errorMessages.CUSTOMER_NAME_MIN_LENGTH],
        maxlength: [constants.USER.NAME_MAX_LENGTH, errorMessages.CUSTOMER_NAME_MAX_LENGTH],
        maxlength: [constants.USER.NAME_MAX_LENGTH, errorMessages.CUSTOMER_NAME_MAX_LENGTH],
        required: [true, errorMessages.CUSTOMER_NAME_REQUIRED]
    },
    age: {
        type: Number,
        required: [true, errorMessages.CUSTOMER_AGE_REQUIRED]
    },
    gender: {
        type: String,
        required: [true, errorMessages.CUSTOMER_GENDER_REQUIRED]
    },
    phone: {
        type: String,
        /* XX9XXXXXXXX ou XXXXXXXXXX */
        // match: [constants.USER.PHONE_NO_REGEX, errorMessages.CUSTOMER_PHONE_INVALID],
        trim: true,
        required: [true, errorMessages.CUSTOMER_PHONE_REQUIRED]
    },
    schedule: String,
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

CustomerSchema.statics.getById = function (id) {
    return this.findById(id)
        .exec()
        .then((customer) => {
            if (customer) {
                return customer;
            }
            const err = new APIError(errorMessages.CUSTOMER_NOT_FOUND, httpStatus.NOT_FOUND);
            return Promise.reject(err);
        })
        .catch(erro => {
            if (!(erro instanceof APIError)) {
                erro = new APIError(errorMessages.CUSTOMER_INVALID_ID, httpStatus.BAD_REQUEST);
            }
            return Promise.reject(erro);
        });
};

CustomerSchema.statics.getByUserName = function (username) {
    return this.findOne({ username })
        .exec()
        .then(customer => {
            if (customer) {
                return customer;
            }
            const err = new APIError(errorMessages.CUSTOMER_NOT_FOUND, httpStatus.NOT_FOUND);
            return Promise.reject(err);
        });
};

CustomerSchema.statics._findByIdAndUpdate = function (idCustomer, customer, options) {
    preUpdate(customer);
    return this.findByIdAndUpdate(idCustomer, customer, options)
};

module.exports = mongoose.model('Customer', CustomerSchema);