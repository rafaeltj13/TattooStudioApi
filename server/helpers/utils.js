const fs = require('fs');

const constants = {
    USER: {
        NAME_MIN_LENGTH: 5,
        NAME_MAX_LENGTH: 50,
        PASSWORD_MIN_LENGTH: 4,
        PASSWORD_MAX_LENGTH: 25,
        EMAIL_REGEX: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        PHONE_NO_REGEX: /^[1-9]{2}9?[0-9]{8}$/
    },
    OWNER: {
        STUDIO_MIN_LENGTH: 5
    }
};

const convertAppointments = (appointments, type) => {
    return appointments.map(appointment => {

        // const image = fs.readFileSync(appointment.tattoo.imagePath);
        const userType = type === 'artist' ? 'customer' :  'artist';

        return {
            id: appointment._id,
            appointmentDate: appointment.appointmentDate,
            price: appointment.price,
            details: {
                name: appointment[userType].name,
                // imageBase64: image.toString('base64')
                imagePath: appointment.tattoo.imagePath
            }
        };
    });
};

module.exports = { constants, convertAppointments }