const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const errorMessages = require('../helpers/errorMessages');
const Schema = mongoose.Schema;

const DayTimeSchema = new Schema({
    morning: [Number],
    afternoon: [Number],
    night: [Number]
});

const WorkTimeSchema = new Schema({
    week: DayTimeSchema,
    saturday: DayTimeSchema,
    sunday: DayTimeSchema,
});

const StudioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, errorMessages.STUDIO_NAME_REQUIRED],
        unique: true,
    },
    address: {
        type: String,
        required: [true, errorMessages.STUDIO_ADDRESS_REQUIRED]
    },
    phone: {
        type: String,
        required: [true, errorMessages.STUDIO_PHONE_REQUIRED]
    },
    workTime: {
        type: WorkTimeSchema,
        required: [true, errorMessages.STUDIO_WORKTIME_REQUIRED]
    },
    artists: [{
        type: Schema.Types.ObjectId,
        ref: 'Artist',
        autopopulate: true
    }],
    pendingArtists: [{
        type: Schema.Types.ObjectId,
        ref: 'Artist',
        autopopulate: true
    }],
    information: String,
    rating: Number,
    createdAt: Date,
    updatedAt: Date
});

StudioSchema.plugin(require('mongoose-autopopulate'));

StudioSchema.pre('save', next => {
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    next();
});

const preUpdate = (studio, next) => {
    delete studio.createdAt;
    studio.updatedAt = Date.now();
    next && next();
};

StudioSchema.options.toJSON = {
    transform: function (doc, ret) {
        delete ret.__v;
    }
};

StudioSchema.methods.getStudio = () => {
    return Promise.resolve(this);
};

StudioSchema.statics.getById = function (id) {
    return this.findById(id)
        .exec()
        .then((studio) => {
            if (studio) {
                return studio;
            }
            const err = new APIError(errorMessages.STUDIO_NOT_FOUND, httpStatus.NOT_FOUND);
            return Promise.reject(err);
        })
        .catch(erro => {
            if (!(erro instanceof APIError)) {
                erro = new APIError(errorMessages.STUDIO_INVALID_ID, httpStatus.BAD_REQUEST);
            }
            return Promise.reject(erro);
        });
};

StudioSchema.statics._findByIdAndUpdate = function (studioId, studio, options) {
    preUpdate(studio);
    return this.findByIdAndUpdate(studioId, studio, options)
};

StudioSchema.statics._artistRequest = function (studioId, artistId) {
    return this.findById(studioId)
        .exec()
        .then((studio) => {
            if (studio) {
                preUpdate(studio);
                studio.pendingArtists.push(artistId)
                return this.findByIdAndUpdate(studioId, studio, { new: true })
            }
            const err = new APIError(errorMessages.STUDIO_NOT_FOUND, httpStatus.NOT_FOUND);
            return Promise.reject(err);
        })
        .catch(erro => {
            if (!(erro instanceof APIError)) {
                erro = new APIError(errorMessages.STUDIO_INVALID_ID, httpStatus.BAD_REQUEST);
            }
            return Promise.reject(erro);
        });
};

StudioSchema.statics._acceptArtist = function (studioId, response) {
    return this.findById(studioId)
        .exec()
        .then((studio) => {
            if (studio) {
                preUpdate(studio);
                studio.pendingArtists = studio.pendingArtists.filter(artist => artist._id === response.artistId);
                if(response.response) studio.artists.push(response.artistId)
                return this.findByIdAndUpdate(studioId, studio, { new: true })
            }
            const err = new APIError(errorMessages.STUDIO_NOT_FOUND, httpStatus.NOT_FOUND);
            return Promise.reject(err);
        })
        .catch(erro => {
            if (!(erro instanceof APIError)) {
                erro = new APIError(errorMessages.STUDIO_INVALID_ID, httpStatus.BAD_REQUEST);
            }
            return Promise.reject(erro);
        });
};

module.exports = mongoose.model('Studio', StudioSchema);