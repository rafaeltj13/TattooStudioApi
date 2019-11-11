const ownerService = require('./owner.service');

const ownerCtrl = {};

ownerCtrl.load = (req, res, next, id) => {
    ownerService.getById(id)
        .then(owner => {
            req['owner'] = owner;
            return next();
        })
        .catch(e => next(e));
};

ownerCtrl.getAll = (req, res, next) => {
    ownerService.getAll(req.query)
        .then(owners => res.json(owners))
        .catch(e => next(e));
};

ownerCtrl.getById = (req, res) => res.json(req.owner);

ownerCtrl.getByParams = (req, res, next) => {
    ownerService.getByParams(req.query)
        .then(owner => res.json(owner))
        .catch(e => next(e));
};

ownerCtrl.create = (req, res, next) => {
    ownerService.create(req.body)
        .then(owner => res.json(owner))
        .catch(e => next(e));
};

ownerCtrl.update = (req, res, next) => {
    ownerService.update(req.params.idOwner, req.body)
        .then(owner => res.json(owner))
        .catch(e => next(e));
};

ownerCtrl.delete = (req, res, next) => {
    ownerService.delete(req.owner._id)
        .then(owner => res.json(owner))
        .catch(e => next(e));
};

module.exports = ownerCtrl;