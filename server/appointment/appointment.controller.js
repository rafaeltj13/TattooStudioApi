const appointmentService = require('./appointment.service');

const appointmentController = {};

appointmentController.load = (req, res, next, id) => {
    appointmentService.getById(id)
        .then(appointment => {
            req['appointment'] = appointment;
            return next();
        })
        .catch(e => next(e));
};

appointmentController.getAll = (req, res, next) => {
    appointmentService.getAll(req.query)
        .then(appointments => res.json(appointments))
        .catch(e => next(e));
};

appointmentController.getById = (req, res) => res.json(req.appointment);

appointmentController.getByParams = (req, res, next) => {
    appointmentService.getByParams(req.query)
        .then(appointment => res.json(appointment))
        .catch(e => next(e));
};

appointmentController.create = (req, res, next) => {
    appointmentService.create(req.body)
        .then(appointment => res.json(appointment))
        .catch(e => next(e));
};

appointmentController.update = (req, res, next) => {
    appointmentService.update(req.body)
        .then(appointment => res.json(appointment))
        .catch(e => next(e));
};

appointmentController.delete = (req, res, next) => {
    appointmentService.delete(req.appointment._id)
        .then(appointment => res.json(appointment))
        .catch(e => next(e));
};

module.exports = appointmentController;