const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const config = require('../../config/config');
const costumerCtrl = require('./costumer.controller');

router.route('/')
    .get(expressJwt({ secret: config.jwtSecret }), costumerCtrl.getAll)
    .post(costumerCtrl.create);

router.route('/:idCostumer')
    .get(expressJwt({ secret: config.jwtSecret }), costumerCtrl.getById)
    .patch(expressJwt({ secret: config.jwtSecret }), costumerCtrl.update)
    .delete(expressJwt({ secret: config.jwtSecret }), costumerCtrl.delete)

router.param('idCostumer', costumerCtrl.load)

module.exports = router;