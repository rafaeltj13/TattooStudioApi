const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const config = require('../../config/config');
const artistCtrl = require('./artist.controller');

router.route('/')
    .get(expressJwt({ secret: config.jwtSecret }), artistCtrl.getAll)
    .post(artistCtrl.create);

router.route('/:idArtist')
    .get(expressJwt({ secret: config.jwtSecret }), artistCtrl.getById)
    .patch(expressJwt({ secret: config.jwtSecret }), artistCtrl.update)
    .delete(expressJwt({ secret: config.jwtSecret }), artistCtrl.delete)

router.param('idArtist', artistCtrl.load)

module.exports = router;