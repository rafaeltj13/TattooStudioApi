const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const errorMessages = require('../helpers/errorMessages')
const Schema = mongoose.Schema;

const ScheduleAppointmentSchema = new Schema({
    appointment: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
        autopopulate: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        autopopulate: true
    },
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'Artist',
        autopopulate: true
    },
    date: {
        type: [Date],
        required: [true, errorMessages.SCHEDULE_DATE_REQUIRED]
    }
});

const ScheduleSchema = new Schema({
    appointments: {
        type: [ScheduleAppointmentSchema],
        required: false
    }
});

ScheduleSchema.plugin(require('mongoose-autopopulate'));

ScheduleSchema.pre('save', function (next) {
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    next();
});

const preUpdate = (schedule, next) => {
    delete schedule.createdAt;
    schedule.updatedAt = Date.now();
    next && next();
};

ScheduleSchema.options.toJSON = {
    transform: function (doc, ret) {
        delete ret.__v;
    }
};

ScheduleSchema.methods.getSchedule = function () {
    return Promise.resolve(this);
};

ScheduleSchema.statics.getById = function (id) {
    return this.findById(id)
        .exec()
        .then((schedule) => {
            if (schedule) {
                return schedule;
            }
            const err = new APIError(errorMessages.SCHEDULE_NOT_FOUND, httpStatus.NOT_FOUND);
            return Promise.reject(err);
        })
        .catch(erro => {
            if (!(erro instanceof APIError)) {
                erro = new APIError(errorMessages.SCHEDULE_INVALID_ID, httpStatus.BAD_REQUEST);
            }
            return Promise.reject(erro);
        });
};

ScheduleSchema.statics._findByIdAndUpdate = function (idSchedule, newAppointment) {
    this.findById(idSchedule)
        .exec()
        .then(schedule => {
            if (schedule) {
                preUpdate(schedule);
                schedule.appointments.push(newAppointment)
                this.replaceOne({ _id: idSchedule }, { appointments: })
                    .then(updatedSchedule => updatedSchedule)
                    .catch(error => reject(error || errorMessages.SCHEDULE_UPDATE));
            }
            const err = new APIError(errorMessages.SCHEDULE_NOT_FOUND, httpStatus.NOT_FOUND);
            return Promise.reject(err);
        })
        .catch(erro => {
            if (!(erro instanceof APIError)) {
                erro = new APIError(errorMessages.SCHEDULE_INVALID_ID, httpStatus.BAD_REQUEST);
            }
            return Promise.reject(erro);
        });
};

module.exports = mongoose.model('Schedule', ScheduleSchema);