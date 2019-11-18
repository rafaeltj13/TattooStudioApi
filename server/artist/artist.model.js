const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const APIError = require('../helpers/APIError');
const errorMessages = require('../helpers/errorMessages')
const { constants } = require('../helpers/utils');
const { validatePassword } = require('../helpers/validator');
const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, errorMessages.ARTIST_PASSWORD_REQUIRED]
    },
    email: {
        type: String,
        match: [constants.USER.EMAIL_REGEX, errorMessages.ARTIST_EMAIL_INVALID],
        required: [true, errorMessages.ARTIST_EMAIL_REQUIRED],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        minlength: [constants.USER.NAME_MIN_LENGTH, errorMessages.ARTIST_NAME_MIN_LENGTH],
        maxlength: [constants.USER.NAME_MAX_LENGTH, errorMessages.ARTIST_NAME_MAX_LENGTH],
        required: [true, errorMessages.ARTIST_NAME_REQUIRED],
        unique: true,
    },
    age: {
        type: Number,
        required: [true, errorMessages.ARTIST_AGE_REQUIRED]
    },
    gender: {
        type: String,
        required: [true, errorMessages.ARTIST_GENDER_REQUIRED]
    },
    phone: {
        type: String,
        trim: true,
        required: [true, errorMessages.ARTIST_PHONE_REQUIRED]
    },
    schedule: {
        type: Schema.Types.ObjectId,
        ref: 'Schedule',
    },
    tattoos: [{
        type: Schema.Types.ObjectId,
        ref: 'Tattoo',
        autopopulate: true
    }],
    studio: {
        type: Schema.Types.ObjectId,
        ref: 'Studio',
    },
    rating: {
        type: Number,
        default: 3.5,
    },
    specialty: String,
    experienceYears: String,
    trace: String,
    photo: String,
    notificationToken: String,
    createdAt: Date,
    updatedAt: Date
});

ArtistSchema.plugin(require('mongoose-autopopulate'));

ArtistSchema.pre('save', function (next) {
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

const preUpdate = (artist, next) => {
    delete artist.password;
    delete artist.createdAt;
    artist.updatedAt = Date.now();
    next && next();
};

ArtistSchema.options.toJSON = {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
    }
};

ArtistSchema.methods.getArtist = function () {
    return Promise.resolve(this);
};

ArtistSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

ArtistSchema.statics.getById = function (id) {
    return this.findById(id)
        .exec()
        .then((artist) => {
            if (artist) {
                return artist;
            }
            const err = new APIError(errorMessages.ARTIST_NOT_FOUND, httpStatus.NOT_FOUND);
            return Promise.reject(err);
        })
        .catch(erro => {
            if (!(erro instanceof APIError)) {
                erro = new APIError(errorMessages.ARTIST_INVALID_ID, httpStatus.BAD_REQUEST);
            }
            return Promise.reject(erro);
        });
};

ArtistSchema.statics.getByUserName = function (username) {
    return this.findOne({ username })
        .exec()
        .then(artist => {
            if (artist) {
                return artist;
            }
            const err = new APIError(errorMessages.ARTIST_NOT_FOUND, httpStatus.NOT_FOUND);
            return Promise.reject(err);
        });
};

ArtistSchema.statics._findByIdAndUpdate = function (idArtist, artist, options) {
    preUpdate(artist);
    return this.findByIdAndUpdate(idArtist, artist, options)
};

ArtistSchema.statics._addTattoo = function (artistId, tattooId) {
    return this.findById(artistId)
        .exec()
        .then(artist => {
            artist.tattoos.push(tattooId);
            return this.findByIdAndUpdate(artistId, artist, { new: true });
        })
        .catch(erro => {
            if (!(erro instanceof APIError)) {
                erro = new APIError(errorMessages.ARTIST_INVALID_ID, httpStatus.BAD_REQUEST);
            }
            return Promise.reject(erro);
        });
};

module.exports = mongoose.model('Artist', ArtistSchema);