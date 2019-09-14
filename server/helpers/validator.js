const errorMessages = require('./errorMessages');
const { constants } = require('./utils');

const validatePassword = password => {
    password = typeof password === 'string' ? password.trim() : password;
    const isInvalid = password.length > constants.USER.PASSWORD_MAX_LENGTH
        || password.length < constants.USER.PASSWORD_MIN_LENGTH;

    return isInvalid ? errorMessages.WRONG_PASSWORD : undefined;
}

module.exports = { validatePassword };