const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const config = require('../../config/config');
const customerCtrl = require('./customer.controller');

router.route('/')
    .get(expressJwt({ secret: config.jwtSecret }), customerCtrl.getAll)
    .post(customerCtrl.create);

router.route('/:idCustomer')
    .get(expressJwt({ secret: config.jwtSecret }), customerCtrl.getById)
    .patch(expressJwt({ secret: config.jwtSecret }), customerCtrl.update)
    .delete(expressJwt({ secret: config.jwtSecret }), customerCtrl.delete)

router.route('/:idCustomer/appointments')
    .get(expressJwt({ secret: config.jwtSecret }), customerCtrl.getAppointments)

router.route('/:idCustomer/schedule')
    .get(expressJwt({ secret: config.jwtSecret }), customerCtrl.getSchedule)

router.route('/:idCustomer/tattoo')
    .get(expressJwt({ secret: config.jwtSecret }), customerCtrl.getTattoos)
    .post(expressJwt({ secret: config.jwtSecret }), customerCtrl.addTattoo)

router.param('idCustomer', customerCtrl.load)

module.exports = router;