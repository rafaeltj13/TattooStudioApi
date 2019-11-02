const artistService = require('./artist.service');
const scheduleService = require('../schedule/schedule.service');

const artistController = {};

artistController.load = (req, res, next, id) => {
    artistService.getById(id)
        .then(artist => {
            req['artist'] = artist;
            return next();
        })
        .catch(e => next(e));
};

artistController.getAll = (req, res, next) => {
    artistService.getAll(req.query)
        .then(artists => res.json(artists))
        .catch(e => next(e));
};

artistController.getById = (req, res) => res.json(req.artist);

artistController.getByParams = (req, res, next) => {
    artistService.getByParams(req.query)
        .then(artist => res.json(artist))
        .catch(e => next(e));
};

artistController.create = (req, res, next) => {
    artistService.create(req.body)
        .then(artist => res.json(artist))
        .catch(e => next(e));
};

artistController.update = (req, res, next) => {
    artistService.update(req.params.idArtist, req.body)
        .then(artist => res.json(artist))
        .catch(e => next(e));
};

artistController.delete = (req, res, next) => {
    artistService.delete(req.artist._id)
        .then(artist => res.json(artist))
        .catch(e => next(e));
};

artistController.getAppointments = (req, res, next) => {
    artistService.getAppointments(req.artist._id)
        .then(appointments => res.json(appointments))
        .catch(e => next(e));
};

artistController.getSchedule = (req, res) => res.json(req.artist.schedule._id);

artistController.getAvailableHours = (req, res, next) => {
    scheduleService.getAvailability(req.artist.schedule, req.query.date, req.query.interval)
        .then(availableHours => res.json(availableHours))
        .catch(e => next(e));
};

artistController.addTattoo = (req, res, next) => {
    artistService.addTattoo(req.params.idArtist, req.body.tattooId)
        .then(customer => res.json(customer))
        .catch(e => next(e));
};

artistController.getTattoos = (req, res) => res.json(req.artist.tattoos);

module.exports = artistController;