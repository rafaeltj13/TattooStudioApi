const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const config = require('../../config/config');
const ownerCtrl = require('./owner.controller');

router.route('/')
    .get(expressJwt({ secret: config.jwtSecret }), ownerCtrl.getAll)
    .post(expressJwt({ secret: config.jwtSecret }), ownerCtrl.create);

router.route('/:idOwner')
    .get(expressJwt({ secret: config.jwtSecret }), ownerCtrl.getById)
    .patch(expressJwt({ secret: config.jwtSecret }), ownerCtrl.update)
    .delete(expressJwt({ secret: config.jwtSecret }), ownerCtrl.delete)

router.param('idOwner', ownerCtrl.load)

module.exports = router;