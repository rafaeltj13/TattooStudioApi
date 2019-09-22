const tattooService = require('./tattoo.service');

const tattooController = {};

tattooController.load = (req, res, next, id) => {
    tattooService.getById(id)
        .then(tattoo => {
            req['tattoo'] = tattoo;
            return next();
        })
        .catch(e => next(e));
};

tattooController.getAll = (req, res, next) => {
    tattooService.getAll(req.query)
        .then(tattoos => res.json(tattoos))
        .catch(e => next(e));
};

tattooController.getById = (req, res) => res.json(req.tattoo);

tattooController.getByParams = (req, res, next) => {
    tattooService.getByParams(req.query)
        .then(tattoo => res.json(tattoo))
        .catch(e => next(e));
};

tattooController.create = (req, res, next) => {
    tattooService.create(req.body, req.body.imageBase64)
        .then(tattoo => res.json(tattoo))
        .catch(e => next(e));
};

tattooController.update = (req, res, next) => {
    tattooService.update(req.body)
        .then(tattoo => res.json(tattoo))
        .catch(e => next(e));
};

tattooController.delete = (req, res, next) => {
    tattooService.delete(req.tattoo._id)
        .then(tattoo => res.json(tattoo))
        .catch(e => next(e));
};

module.exports = tattooController;