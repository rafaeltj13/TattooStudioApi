const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const config = require('../../config/config');
const tattooCtrl = require('./tattoo.controller');

router.route('/')
    .get(expressJwt({ secret: config.jwtSecret }), tattooCtrl.getAll)
    .post(expressJwt({ secret: config.jwtSecret }), tattooCtrl.create);

router.route('/:idTattoo')
    .get(expressJwt({ secret: config.jwtSecret }), tattooCtrl.getById)
    .patch(expressJwt({ secret: config.jwtSecret }), tattooCtrl.update)
    .delete(expressJwt({ secret: config.jwtSecret }), tattooCtrl.delete)

router.param('idTattoo', tattooCtrl.load)

module.exports = router;