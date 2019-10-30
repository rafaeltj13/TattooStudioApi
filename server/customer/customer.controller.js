const customerService = require('./customer.service');

const customerController = {};

customerController.load = (req, res, next, id) => {
    customerService.getById(id)
        .then(customer => {
            req['customer'] = customer;
            return next();
        })
        .catch(e => next(e));
};

customerController.getAll = (req, res, next) => {
    customerService.getAll(req.query)
        .then(customers => res.json(customers))
        .catch(e => next(e));
};

customerController.getById = (req, res) => res.json(req.customer);

customerController.getByParams = (req, res, next) => {
    customerService.getByParams(req.query)
        .then(customer => res.json(customer))
        .catch(e => next(e));
};

customerController.create = (req, res, next) => {
    customerService.create(req.body)
        .then(customer => res.json(customer))
        .catch(e => next(e));
};

customerController.update = (req, res, next) => {
    customerService.update(req.params.idCustomer, req.body)
        .then(customer => res.json(customer))
        .catch(e => next(e));
};

customerController.delete = (req, res, next) => {
    customerService.delete(req.customer._id)
        .then(customer => res.json(customer))
        .catch(e => next(e));
};

customerController.getAppointments = (req, res, next) => {
    customerService.getAppointments(req.customer._id)
        .then(appointments => res.json(appointments))
        .catch(e => next(e));
};

customerController.getSchedule = (req, res) => res.json(req.customer.schedule._id);

customerController.addTattoo = (req, res, next) => {
    customerService.addTattoo(req.params.idCustomer, req.body.tattooId)
        .then(customer => res.json(customer))
        .catch(e => next(e));
};

module.exports = customerController;