const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const errorMessages = require('../helpers/errorMessages')
const { constants } = require('../helpers/utils');
const TattooSchema = require('../tattoo/tattoo.model.js');

const AppointmentSchema = new mongoose.Schema({
    date: [Date],
    tattoo: TattooSchema,
    // art: ArtSchema,
    totalDuration: Number,
    sessions: Number,
    price: Number,
    createdAt: Date,
    updatedAt: Date
});

AppointmentSchema.pre('save', function (next) {
    this.dataCriacao = Date.now();
    this.dataEdicao = Date.now();
    next();
});

const preUpdate = (appointment, next) => {
    delete appointment.dataCriacao;
    appointment.dataEdicao = Date.now();
    next && next();
};

AppointmentSchema.options.toJSON = {
    transform: function (doc, ret) {
        delete ret.__v;
    }
};

AppointmentSchema.methods.getAppointment = () => {
    return Promise.resolve(this);
};

AppointmentSchema.statics.getById = id => {
    return this.findById(id)
      .exec()
      .then((appointment) => {
        if (appointment) {
          return appointment;
        }
        const err = new APIError(errorMessages.APPOINTMENT_NOT_FOUND, httpStatus.NOT_FOUND);
        return Promise.reject(err);
      })
      .catch(erro => {
        if (!(erro instanceof APIError)) {
          erro = new APIError(errorMessages.APPOINTMENT_INVALID_ID, httpStatus.BAD_REQUEST);
        }
        return Promise.reject(erro);
      });
};

AppointmentSchema.statics._findByIdAndUpdate = (idAppointment, appointment, options) => {
    preUpdate(appointment);
    return this.findByIdAndUpdate(idAppointment, appointment, options)
};

module.exports = mongoose.model('Appointment', AppointmentSchema);