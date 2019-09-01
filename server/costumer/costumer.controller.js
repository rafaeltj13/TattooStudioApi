const costumerService = require('./costumer.service');

const costumerController = {};

costumerController.load = (req, res, next, id) => {
    costumerService.load(id)
        .then(costumer => {
            req['costumer'] = costumer;
            return next();
        })
        .catch(e => next(e));
};

costumerController.getAll = (req, res, next) => {
    costumerService.getAll(req.query)
        .then(costumers => res.json(costumers))
        .catch(e => next(e));
};

costumerController.getById = (req, res) => res.json(req.costumer);

costumerController.getByParams = (req, res, next) => {
    costumerService.getByParams(req.query)
        .then(costumer => res.json(costumer))
        .catch(e => next(e));
};

costumerController.create = (req, res, next) => {
    costumerService.create(req.body)
        .then(costumer => res.json(costumer))
        .catch(e => next(e));
};

costumerController.update = (req, res, next) => {
    costumerService.update(req.body)
        .then(costumer => res.json(costumer))
        .catch(e => next(e));
};

costumerController.delete = (req, res, next) => {
    costumerService.delete(req.costumer._id)
        .then(costumer => res.json(costumer))
        .catch(e => next(e));
};

module.exports = costumerController;