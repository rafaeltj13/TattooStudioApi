const express = require('express');
const authCtrl = require('./auth.controller');

const router = express.Router();

router.route('/signinCustomer')
  .post(authCtrl.signinCustomer)

// router.route('signinOwner')
//   .post(authCtrl.signinOwner)

module.exports = router;