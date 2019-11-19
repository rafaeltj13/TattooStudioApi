const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const config = require('../../config/config');
const ownerCtrl = require('./owner.controller');

router.route('/')
    .get(expressJwt({ secret: config.jwtSecret }), ownerCtrl.getAll)
    .post(ownerCtrl.create);

router.route('/:idOwner')
    .get(expressJwt({ secret: config.jwtSecret }), ownerCtrl.getById)
    .patch(expressJwt({ secret: config.jwtSecret }), ownerCtrl.update)
    .delete(expressJwt({ secret: config.jwtSecret }), ownerCtrl.delete)

router.route('/:idOwner/studioAppointments')
    .get(expressJwt({ secret: config.jwtSecret }), ownerCtrl.studioAppointments);

router.route('/:idOwner/artists')
    .get(expressJwt({ secret: config.jwtSecret }), ownerCtrl.getArtists);

router.route('/:idOwner/pendingArtists')
    .get(expressJwt({ secret: config.jwtSecret }), ownerCtrl.pendingArtists);

router.route('/:idOwner/artistRequest')
    .post(expressJwt({ secret: config.jwtSecret }), ownerCtrl.artistRequest);

router.route('/:idOwner/acceptArtist')
    .post(expressJwt({ secret: config.jwtSecret }), ownerCtrl.acceptArtist);

router.param('idOwner', ownerCtrl.load)

module.exports = router;