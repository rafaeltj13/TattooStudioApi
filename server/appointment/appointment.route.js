const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const config = require('../../config/config');
const appointmentCtrl = require('./appointment.controller');

router.route('/')
    .get(expressJwt({ secret: config.jwtSecret }), appointmentCtrl.getAll)
    .post(expressJwt({ secret: config.jwtSecret }), appointmentCtrl.create);

router.route('/:idAppointment')
    .get(expressJwt({ secret: config.jwtSecret }), appointmentCtrl.getById)
    .patch(expressJwt({ secret: config.jwtSecret }), appointmentCtrl.update)
    .delete(expressJwt({ secret: config.jwtSecret }), appointmentCtrl.delete);

router.route('/:typeUser/:idUser')
    .get(expressJwt({ secret: config.jwtSecret }), appointmentCtrl.getAppointments);

router.param('idAppointment', appointmentCtrl.load)

module.exports = router;