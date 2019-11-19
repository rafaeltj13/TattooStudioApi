const express = require('express');
const authCtrl = require('./auth.controller');

const router = express.Router();

router.route('/signincustomer')
  .post(authCtrl.signinCustomer)

router.route('/signinartist')
  .post(authCtrl.signinArtist)

router.route('/signinowner')
  .post(authCtrl.signinOwner)

module.exports = router;