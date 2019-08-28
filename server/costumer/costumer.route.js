const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const config = require('../../config/config');
const costumerCtrl = require('./costumer.controller');

router.route('/')
    .get(expressJwt({ secret: config.jwtSecret }), costumerCtrl.getAll)
    .post(costumerCtrl.create);

module.exports = router;