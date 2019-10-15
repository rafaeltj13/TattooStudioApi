const scheduleService = require('./schedule.service');

const scheduleController = {};

scheduleController.load = (req, res, next, id) => {
    scheduleService.getById(id)
        .then(schedule => {
            req['schedule'] = schedule;
            return next();
        })
        .catch(e => next(e));
};

scheduleController.getAll = (req, res, next) => {
    scheduleService.getAll(req.query)
        .then(schedules => res.json(schedules))
        .catch(e => next(e));
};

scheduleController.getById = (req, res) => res.json(req.schedule);

scheduleController.getByParams = (req, res, next) => {
    scheduleService.getByParams(req.query)
        .then(schedule => res.json(schedule))
        .catch(e => next(e));
};

scheduleController.create = (req, res, next) => {
    scheduleService.create(req.body)
        .then(schedule => res.json(schedule))
        .catch(e => next(e));
};

scheduleController.update = (req, res, next) => {
    scheduleService.update(req.params.idSchedule, req.body)
        .then(schedule => res.json(schedule))
        .catch(e => next(e));
};

scheduleController.delete = (req, res, next) => {
    scheduleService.delete(req.schedule._id)
        .then(schedule => res.json(schedule))
        .catch(e => next(e));
};

module.exports = scheduleController;