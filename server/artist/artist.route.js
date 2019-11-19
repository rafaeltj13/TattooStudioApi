const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const config = require('../../config/config');
const artistCtrl = require('./artist.controller');

router.route('/')
    .get(expressJwt({ secret: config.jwtSecret }), artistCtrl.getAll)
    .post(artistCtrl.create);

router.route('/featured')
    .get(expressJwt({ secret: config.jwtSecret }), artistCtrl.getFeaturedArtists)

router.route('/:idArtist')
    .get(expressJwt({ secret: config.jwtSecret }), artistCtrl.getById)
    .patch(expressJwt({ secret: config.jwtSecret }), artistCtrl.update)
    .delete(expressJwt({ secret: config.jwtSecret }), artistCtrl.delete)

router.route('/:idArtist/appointments')
    .get(expressJwt({ secret: config.jwtSecret }), artistCtrl.getAppointments)

router.route('/:idArtist/schedule')
    .get(expressJwt({ secret: config.jwtSecret }), artistCtrl.getSchedule)

router.route('/:idArtist/availableHours')
    .get(expressJwt({ secret: config.jwtSecret }), artistCtrl.getAvailableHours)

router.route('/:idArtist/tattoo')
    .get(expressJwt({ secret: config.jwtSecret }), artistCtrl.getTattoos)
    .post(expressJwt({ secret: config.jwtSecret }), artistCtrl.addTattoo)

router.route('/:idArtist/rate')
    .patch(expressJwt({ secret: config.jwtSecret }), artistCtrl.rateArtist)

router.param('idArtist', artistCtrl.load)

module.exports = router;