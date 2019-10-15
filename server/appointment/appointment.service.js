const Appointment = require('./appointment.model');
const errorMessages = require('../helpers/errorMessages');
const { convertAppointments } = require('../helpers/utils');

const appointmentService = {};

appointmentService.getAll = (params = {}) => new Promise((resolve, reject) => {
    Appointment.find(params)
        .then(appointments => resolve(appointments))
        .catch(error => reject(error || errorMessages.APPOINTMENT_NOT_FOUND));
});

appointmentService.getById = id => new Promise((resolve, reject) => {
    Appointment.getById(id)
        .then(appointment => resolve(appointment))
        .catch(error => reject(error || errorMessages.APPOINTMENT_NOT_FOUND));
});

appointmentService.getByParams = (params = {}) => new Promise((resolve, reject) => {
    Appointment.findOne(params)
        .then(appointment => resolve(appointment))
        .catch(error => reject(error || errorMessages.APPOINTMENT_NOT_FOUND));
});

appointmentService.create = appointment => new Promise((resolve, reject) => {
    newAppointment = new Appointment(appointment);
    newAppointment.save()
        .then(savedAppointment => resolve(savedAppointment))
        .catch(error => reject(error || errorMessages.APPOINTMENT_SAVE));
});

appointmentService.update = (appointmentId, appointment) => new Promise((resolve, reject) => {
    Appointment._findByIdAndUpdate(appointmentId, appointment, { new: true })
        .then(updatedAppointment => resolve(updatedAppointment))
        .catch(error => reject(error || errorMessages.APPOINTMENT_UPDATE));
});

appointmentService.delete = id => new Promise((resolve, reject) => {
    appointmentService.getById(id)
        .then(appointment => {
            Appointment.remove({ _id: id })
                .then(() => resolve(id))
                .catch(error => reject(error || errorMessages.APPOINTMENT_DELETE));
        })
        .catch(erro => reject(erro));
});

appointmentService.getAppointments = (params = {}) => new Promise((resolve, reject) => {
    const query = params.typeUser === 'artist' ? { artist: params.idUser } : { customer: params.idUser };

    Appointment.find(query)
        .then(appointments => resolve(convertAppointments(appointments, params.typeUser)))
        .catch(error => reject(error || errorMessages.APPOINTMENT_NOT_FOUND));
});

module.exports = appointmentService;