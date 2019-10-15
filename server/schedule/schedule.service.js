const Schedule = require('./schedule.model');
const errorMessages = require('../helpers/errorMessages');

const scheduleService = {};

scheduleService.getAll = (params = {}) => new Promise((resolve, reject) => {
    Schedule.find(params)
        .then(schedules => resolve(schedules))
        .catch(error => reject(error || errorMessages.SCHEDULE_NOT_FOUND));
});

scheduleService.getById = id => new Promise((resolve, reject) => {
    Schedule.getById(id)
        .then(schedule => resolve(schedule))
        .catch(error => reject(error || errorMessages.SCHEDULE_NOT_FOUND));
});

scheduleService.getByParams = (params = {}) => new Promise((resolve, reject) => {
    Schedule.findOne(params)
        .then(schedule => resolve(schedule))
        .catch(error => reject(error || errorMessages.SCHEDULE_NOT_FOUND));
});

scheduleService.create = schedule => new Promise((resolve, reject) => {
    newSchedule = new Schedule(schedule);
    newSchedule.save()
        .then(savedSchedule => resolve(savedSchedule))
        .catch(error => reject(error || errorMessages.SCHEDULE_SAVE));
});

scheduleService.update = (scheduleId, newAppointment) => new Promise((resolve, reject) => {
    Schedule._findByIdAndUpdate(scheduleId, newAppointment)
        .then(updatedSchedule => resolve(updatedSchedule))
        .catch(error => reject(error || errorMessages.SCHEDULE_UPDATE));
});

scheduleService.delete = id => new Promise((resolve, reject) => {
    scheduleService.getById(id)
        .then(schedule => {
            Schedule.remove({ _id: id })
                .then(() => resolve(id))
                .catch(error => reject(error || errorMessages.SCHEDULE_DELETE));
        })
        .catch(erro => reject(erro));
});

module.exports = scheduleService;