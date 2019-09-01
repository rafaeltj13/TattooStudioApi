const errorMessages = require('./errorMessages');
const { constants } = require('./utils');

const validatePassword = password => {
    password = typeof password === 'string' ? password.trim() : password;
    const isInvalid = password.length > constants.COSTUMER.PASSWORD_MAX_LENGTH
        || password.length < constants.COSTUMER.PASSWORD_MIN_LENGTH;

    return isInvalid ? errorMessages.COSTUMER_PASSWORD_INVALID : undefined;
}

module.exports = { validatePassword };