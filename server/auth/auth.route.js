const express = require('express');
const authCtrl = require('./auth.controller');

const router = express.Router();

router.route('/signinCostumer')
  .post(authCtrl.signinCostumer)

// router.route('signinOwner')
//   .post(authCtrl.signinOwner)

module.exports = router;