const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const { getInitialAvailableHoursInterval, getAvailableHours } = require('../services/intervalService');
const errorMessages = require('../helpers/errorMessages')
const Schema = mongoose.Schema;

const ScheduleDateSchema = new Schema({
    date: {
        type: Date,
        required: [true, errorMessages.SCHEDULE_DATE_REQUIRED]
    },
    start: {
        type: Number,
        required: [true, errorMessages.SCHEDULE_START_DATE_REQUIRED]
    },
    end: {
        type: Number,
        required: [true, errorMessages.SCHEDULE_END_DATE_REQUIRED]
    }
})

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
    dates: {
        type: [ScheduleDateSchema],
        required: [true, errorMessages.SCHEDULE_DATE_REQUIRED]
    },
    atualSession: {
        type: Number,
        required: [true, errorMessages.SCHEDULE_ATUAL_SESSION_REQUIRED]
    }
});

const ScheduleSchema = new Schema({
    appointments: {
        type: [ScheduleAppointmentSchema],
        required: false
    },
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

ScheduleSchema.statics._findByIdAndUpdate = function (idSchedule, newAppointment, options) {
    return this.findById(idSchedule)
        .exec()
        .then(schedule => {
            if (schedule) {
                preUpdate(schedule);
                schedule.appointments.push(newAppointment);
                return this.findByIdAndUpdate(idSchedule, schedule, options)
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

ScheduleSchema.statics._getAvailableHours = function (scheduleId, date, interval) {
    return this.findById(scheduleId)
        .exec()
        .then(schedule => {
            if (schedule) {

                const morning = [8,12];
                const afternoon = [14,18];
                const night = [20,22];

                const initialAvailableHours = getInitialAvailableHoursInterval(morning, afternoon, night);
                const availableHours = getAvailableHours(initialAvailableHours, schedule.appointments, date);
                const availableIntervals = getAvailableIntervals(availableHours, interval);

                return availableIntervals;

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