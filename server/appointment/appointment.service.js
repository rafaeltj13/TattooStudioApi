const Appointment = require('./appointment.model');
const errorMessages = require('../helpers/errorMessages');
const { convertAppointments } = require('../helpers/utils');
const customerService = require('../customer/customer.service');
const artistService = require('../artist/artist.service');
const scheduleService = require('../schedule/schedule.service');

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

appointmentService.create = (appointment, customerId, artistId) => new Promise((resolve, reject) => {
    newAppointment = new Appointment(appointment);
    newAppointment.save()
        .then(savedAppointment => {
            const customerPromise = customerService.getSchedule(customerId)
                .then(scheduleId => scheduleService.update(scheduleId, {
                    appointment: savedAppointment._id,
                    customer: customerId,
                    artist: artistId
                }))
                .catch(error => reject(error || errorMessages.APPOINTMENT_UPDATE));

            const artistPromise = artistService.getSchedule(artistId)
                .then(scheduleId => scheduleService.update(scheduleId, {
                    appointment: savedAppointment._id,
                    customer: customerId,
                    artist: artistId
                }))
                .catch(error => reject(error || errorMessages.APPOINTMENT_UPDATE));

            Promise.all([customerPromise, artistPromise])
                .then(() => resolve(savedAppointment))
                .catch(error => reject(error || errorMessages.APPOINTMENT_UPDATE));
        })
        .catch(error => reject(error || errorMessages.APPOINTMENT_SAVE));
});

appointmentService.update = (appointmentId, appointment) => new Promise((resolve, reject) => {
    Appointment._findByIdAndUpdate(appointmentId, appointment, { new: true })
        .then(updatedAppointment => {
            if (appointment.details)
                scheduleService.updateDates(appointmentId,
                    appointment.details.customerScheduleId,
                    appointment.details.artistScheduleId,
                    appointment.dates)
                    .then(() => resolve(updatedAppointment))
                    .catch(error => reject(error || errorMessages.APPOINTMENT_UPDATE));
            else resolve(updatedAppointment)
        })
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