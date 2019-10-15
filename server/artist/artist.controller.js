const artistService = require('./artist.service');

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

module.exports = artistController;