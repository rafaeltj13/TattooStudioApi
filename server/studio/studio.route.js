const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const config = require('../../config/config');
const studioCtrl = require('./studio.controller');

router.route('/')
    .get(expressJwt({ secret: config.jwtSecret }), studioCtrl.getAll)
    .post(expressJwt({ secret: config.jwtSecret }), studioCtrl.create);

router.route('/:idStudio')
    .get(expressJwt({ secret: config.jwtSecret }), studioCtrl.getById)
    .patch(expressJwt({ secret: config.jwtSecret }), studioCtrl.update)
    .delete(expressJwt({ secret: config.jwtSecret }), studioCtrl.delete)

router.param('idStudio', studioCtrl.load)

module.exports = router;