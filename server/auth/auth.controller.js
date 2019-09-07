const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const errorMessages = require('../helpers/errorMessages');
const Costumer = require('../costumer/costumer.model')

const authController = {};

authController.signinCostumer = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  Costumer.getByUserName(username).then(costumer => {
    if (costumer.comparePassword(password)) {
      const token = jwt.sign({
        idCostumer: costumer._id
      }, config.jwtSecret);

      return res.json({
        token,
        username: costumer.username
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

module.exports = authController;
