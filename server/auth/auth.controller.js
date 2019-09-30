const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const errorMessages = require('../helpers/errorMessages');
const Customer = require('../customer/customer.model')

const authController = {};

authController.signinCustomer = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  Customer.getByUserName(username).then(customer => {
    if (customer.comparePassword(password)) {
      const token = jwt.sign({
        idCustomer: customer._id
      }, config.jwtSecret);

      return res.json({
        token,
        id: customer._id,
        username: customer.username
      });
    } else {
      const err = new APIError(errorMessages.COSTUMER_PASSWORD_INVALID, httpStatus.UNAUTHORIZED);
      return next(err);
    }
  }).catch(error => {
    const err = new APIError(error, httpStatus.BAD_REQUEST);
    return next(err);
  })
}

authController.signinArtist = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  Artist.getByUserName(username).then(artist => {
    if (artist.comparePassword(password)) {
      const token = jwt.sign({
        idArtist: artist._id
      }, config.jwtSecret);

      return res.json({
        token,
        id: artist._id,
        username: artist.username
      });
    } else {
      const err = new APIError(errorMessages.ARTIST_PASSWORD_INVALID, httpStatus.UNAUTHORIZED);
      return next(err);
    }
  }).catch(error => {
    const err = new APIError(error, httpStatus.BAD_REQUEST);
    return next(err);
  })
}

module.exports = authController;
