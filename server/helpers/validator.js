const { COSTUMER } = require('./constants');
const errorMessages = require('./errorMessages');

const validatePassword = password => {
    password = typeof password === 'string' ? password.trim() : password;
    const isInvalid = password.length < COSTUMER.PASSWORD_MIN_LENGTH
        || password.length > COSTUMER.PASSWORD_MAX_LENGTH;

    return isInvalid ? errorMessages.COSTUMER_PASSWORD_INVALID : undefined;
}

module.exports = { validatePassword };