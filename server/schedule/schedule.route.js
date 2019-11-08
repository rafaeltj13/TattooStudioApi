const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const config = require('../../config/config');
const scheduleCtrl = require('./schedule.controller');

router.route('/')
    .get(expressJwt({ secret: config.jwtSecret }), scheduleCtrl.getAll)
    .post(expressJwt({ secret: config.jwtSecret }), scheduleCtrl.create);

router.route('/:idSchedule')
    .get(expressJwt({ secret: config.jwtSecret }), scheduleCtrl.getById)
    .patch(expressJwt({ secret: config.jwtSecret }), scheduleCtrl.update)
    .delete(expressJwt({ secret: config.jwtSecret }), scheduleCtrl.delete);

router.route('/:idSchedule/availability')
    .get(expressJwt({ secret: config.jwtSecret }), scheduleCtrl.getAvailability)

router.param('idSchedule', scheduleCtrl.load)

module.exports = router;