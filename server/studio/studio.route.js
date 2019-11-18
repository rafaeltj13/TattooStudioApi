const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const config = require('../../config/config');
const studioCtrl = require('./studio.controller');

router.route('/')
    .get(studioCtrl.getAll)
    .post(studioCtrl.create);

router.route('/:idStudio')
    .get(expressJwt({ secret: config.jwtSecret }), studioCtrl.getById)
    .patch(expressJwt({ secret: config.jwtSecret }), studioCtrl.update)
    .delete(expressJwt({ secret: config.jwtSecret }), studioCtrl.delete);

router.route('/:idStudio/artistRequest')
    .post(expressJwt({ secret: config.jwtSecret }), studioCtrl.artistRequest);

router.route('/:idStudio/acceptArtist')
    .post(expressJwt({ secret: config.jwtSecret }), studioCtrl.acceptArtist);

router.param('idStudio', studioCtrl.load)

module.exports = router;