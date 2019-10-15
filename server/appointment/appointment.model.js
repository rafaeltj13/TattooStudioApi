const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const errorMessages = require('../helpers/errorMessages')
const Schema = mongoose.Schema;

const AppointmentSchema = new mongoose.Schema({
  tattoo: {
    type: Schema.Types.ObjectId,
    ref: 'Tattoo',
    autopopulate: true
  },
  status: {
    type: String,
  required: [true, errorMessages.APPOINTMENT_STATUS_REQUIRED]
  },
  totalDuration: Number,
  sessions: Number,
  price: Number,
  installments: Number,
  createdAt: Date,
  updatedAt: Date
});

AppointmentSchema.plugin(require('mongoose-autopopulate'));

AppointmentSchema.pre('save', function (next) {
  this.createdAt = Date.now();
  this.updatedAt = Date.now();
  next();
});

const preUpdate = (appointment, next) => {
  delete appointment.createdAt;
  appointment.updatedAt = Date.now();
  next && next();
};

AppointmentSchema.options.toJSON = {
  transform: function (doc, ret) {
    delete ret.__v;
  }
};

AppointmentSchema.methods.getAppointment = function () {
  return Promise.resolve(this);
};

AppointmentSchema.statics.getById = function (id) {
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

AppointmentSchema.statics._findByIdAndUpdate = function (idAppointment, appointment, options) {
  preUpdate(appointment);
  return this.findByIdAndUpdate(idAppointment, appointment, options)
};

module.exports = mongoose.model('Appointment', AppointmentSchema);